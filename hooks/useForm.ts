import { useEffect, useState } from 'react';

type Validation<T> = { [K in keyof Partial<T>]?: boolean };
type Rules<T> = {
  [K in keyof T]?: ((value: T[K]) => boolean | undefined) | undefined;
};

type Values<T> = {
  [K in keyof T]: T[K];
};

type Config<T> = {
  /** List of optional properties. Optional properties will be marked as valid if left empty. */
  optional?: Array<keyof T>;
  /** Validation rules by specified property name. If you define a validation rule function here, the field will be validated against it. If no rule is set, a crude value check will be used instead (Boolean(value)) */
  rules?: Rules<T>;
};

function useFormState<T>(
  values: Values<T>,
  onNewInitialValue: (key: keyof T, value: T[keyof T]) => void,
) {
  const [initialValues, setInitialValues] = useState(values);
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

  const valuesChanged = Object.keys(values).filter((key) =>
    compareValues(key as keyof T),
  );

  function updateFromNewValues() {
    if (!valuesChanged.length) {
      return;
    }

    const update = { ...state };

    for (const key in values) {
      if (initialValues[key] !== values[key]) {
        update[key] = values[key];
        setInitialValues((s) => ({ ...s, [key]: values[key] }));
        onNewInitialValue(key, values[key]);
      }
    }

    setState(update);
  }

  useEffect(updateFromNewValues);

  return {
    state,
    initialValues,
    setState,
  };
}

/** One-fits-all solution to manage state changes, field validation and optional entries within a form.
 * @example <caption>Simple use case:</caption>
 *  const { state, validation, onUpdate } = useForm({ email: '', password: '', });
 *
 *
 * @example <caption>For more complex form states (ie one field can be of multiple types), you should pass the form's type:</caption>
 * const { state, validation, onUpdate } = useForm<{ numericOrUndefined: number | undefined }>({ numericOrUndefined: undefined }, { rules: { numericOrUndefined: (value: number | undefined): boolean | undefined => ... }});
 *
 */
export function useForm<T, R extends T = T>(
  values: Values<T>,
  config?: Config<R>,
) {
  const [validation, setValidation] = useState<Validation<T>>({});
  const { state, setState, initialValues } = useFormState(
    values,
    (key, value) =>
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setValidation((s) => ({ ...s, [key]: localValidation(key, value) })),
  );

  function validateByRule(key: keyof T, value: T[keyof T] | undefined) {
    if (!value) {
      return undefined;
    }

    if (!config || !config.rules || config.rules[key] === undefined) {
      return Boolean(value);
    }

    const isValid = config.rules[key]?.(value as R[keyof T]);
    return isValid;
  }

  function localValidation(key: keyof T, value: T[keyof T] | undefined) {
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
    setValidation((s) => ({
      ...s,
      [key]: validate ? localValidation(key, value) : undefined,
    }));
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
  function resetValidation() {
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
    resetValidation();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(resetValidation, []);
  return {
    state,
    validation,
    hasChanged,
    onUpdate,
    isFormValid,
    clearForm,
    clearState,
    resetValidation,
  };
}
