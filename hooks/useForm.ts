import { useEffect, useRef, useState } from 'react';

type Validation<T> = { [K in keyof Partial<T>]?: boolean };
type Rules<T> = { [K in keyof T]?: (value: T[K]) => boolean | undefined };
type Values<T> = {
  [K in keyof T]: T[K];
};

function useFormState<T>(values: Values<T>) {
  const initialValues = useRef(values).current;
  const [state, setState] = useState(values);

  function compareValues(key: keyof T) {
    // Fallback for date handling (Date object causes constant changes for some reason)
    if (values[key] instanceof Date) {
      return (
        ((values[key] as unknown) as Date).toISOString() !==
        ((initialValues[key] as unknown) as Date).toISOString()
      );
    }

    // Very crudely handle object type changes. Could be performance intensive based on the size of the object.
    if (typeof values[key] === 'object') {
      return JSON.stringify(values[key]) !== JSON.stringify(initialValues[key]);
    }

    return values[key] !== initialValues[key];
  }

  const hasChanged = Object.keys(values).filter((key) =>
    compareValues(key as keyof T),
  );

  function updateFromNewValues() {
    if (!hasChanged.length) {
      return;
    }

    const update = { ...state };
    for (const key in values) {
      if (initialValues[key] !== values[key]) {
        update[key] = values[key];
        initialValues[key] = values[key];
      }
    }

    setState(update);
  }

  useEffect(updateFromNewValues, [hasChanged]);

  return { state, initialValues, setState };
}

export function useForm<T>(
  values: Values<T>,
  config?: {
    /** Validation rules by specified property name. If you define a validation rule function here, the field will be validated against it. If no rule is set, a crude value check will be used instead (Boolean(value)) */
    rules?: Rules<T>;
    /** List of optional properties. Optional properties will be marked as valid if left empty. */
    optional?: Array<keyof T>;
  },
) {
  const { state, setState, initialValues } = useFormState(values);
  const [validation, setValidation] = useState<Validation<T>>({});

  function updateValidationByKey(key: keyof T, isValid: boolean | undefined) {
    setValidation((v) => ({ ...v, [key]: isValid }));
  }

  function validateByRule(key: keyof T, value?: T[keyof T]) {
    if (!config || !config.rules || config.rules[key] === undefined) {
      return value ? Boolean(value) : undefined;
    }

    const isValid = config.rules[key]?.(value || values[key]);
    return isValid;
  }

  function localValidation(key: keyof T, value: T[keyof T]) {
    let isValid = validateByRule(key, value);
    const isOptional = config?.optional?.includes(key);

    if (isOptional && isValid === undefined) {
      isValid = true;
    }

    return isValid;
  }

  function isOptional(key: keyof T) {
    return config?.optional?.includes(key);
  }

  /** This function updates the specific property with a new value and validates it if it needs to do so.
   * Best used in conjunction with the prebuilt _Input field, but can be used generally. */
  function onUpdate(key: keyof T, value: T[keyof T], validate?: boolean) {
    setState((s) => ({ ...s, [key]: value }));
    updateValidationByKey(
      key,
      validate ? localValidation(key, value) : undefined,
    );
  }

  /** Boolean value of whether the form is valid (ie can be submitted). Use this to disable/enable form submission. */
  function isFormValid() {
    return !Object.keys(values).some((key) =>
      isOptional(key as keyof T)
        ? validation[key as keyof T] === false
        : !validation[key as keyof T],
    );
  }

  /** Boolean value of whether the form has changed from it's initially set values. */
  function hasChanged() {
    return Object.keys(state).some(
      (key) => initialValues[key as keyof T] !== state[key as keyof T],
    );
  }

  /** Resets changed values to initial state */
  function clearState() {
    setState(values);
  }

  /** Resets validation to initial state.
   * Generally you would not be using this unless for something completely custom, at which point maybe you should not be using this hook at all.
   * */
  function clearValidation() {
    const validity: Validation<T> = {};
    for (const key in values) {
      const isValid = localValidation(key, values[key]);
      validity[key] = isValid;
    }

    setValidation(validity);
  }

  /** Resets entire form, state and validation included */
  function clearForm() {
    clearState();
    clearValidation();
  }

  function onMount() {
    const validity: Validation<T> = {};

    for (const key in values) {
      const isValid = localValidation(key, values[key]);
      validity[key] = isValid;
    }

    setValidation(validity);
  }

  useEffect(onMount, []);

  return {
    state,
    validation,
    hasChanged,
    onUpdate,
    isFormValid,
    clearForm,
    clearState,
    clearValidation,
  };
}
