import { useEffect, useState } from 'react';

type Validation<T> = { [K in keyof Partial<T>]?: boolean };
type Rules<T> = {
  [K in keyof T]?: ((value: T[K]) => boolean | undefined) | undefined;
};

type Values<T> = {
  [K in keyof T]: T[K];
};

type Config<R> = {
  /** List of optional properties. Optional properties will be marked as valid if left empty. */
  optional?: Array<keyof R>;
  /** Validation rules by specified property name. If you define a validation rule function here, the field will be validated against it. If no rule is set, a crude value check will be used instead (Boolean(value)) */
  rules?: Rules<R>;
  /** Will compare key/value pairs instead of just top level JSON.stringify on complex objects/arrays */
  deepCompare?: boolean;
};

function compareValues(
  value: unknown,
  initialValue: unknown,
  deepCompare?: boolean,
): boolean {
  // Fallback for date handling (Date object causes constant changes for some reason)
  if (value instanceof Date) {
    return (
      (value as Date).toISOString() !== (initialValue as Date).toISOString()
    );
  }

  // Very crudely handle object type changes. Could be performance intensive based on the size of the object.
  if (value instanceof Object && initialValue instanceof Object) {
    if (!deepCompare) {
      const valueString = JSON.stringify({ ...value });
      const initialValueString = JSON.stringify({ ...initialValue });
      return valueString !== initialValueString;
    }

    if (Array.isArray(value) && Array.isArray(initialValue)) {
      if (value.length !== initialValue.length) {
        return true;
      }

      return value.some((item, index) =>
        compareValues(item, initialValue[index]),
      );
    }

    // Very crudely handle object type changes. Could be performance intensive based on the size of the object.
    if (value instanceof Object && initialValue instanceof Object) {
      const castValue = value as Record<string, unknown>;
      const castInitialValue = initialValue as Record<string, unknown>;

      return Object.keys(value).some((key) =>
        compareValues(castValue[key], castInitialValue[key]),
      );
    }
  }

  return value !== initialValue;
}

function useFormState<T, R>(values: Values<T>, config?: Config<R>) {
  const [initialValues, setInitialValues] = useState(values);
  const [state, setState] = useState(values);

  const valuesChanged = Object.keys(values).filter((key) =>
    compareValues(
      values[key as keyof T],
      initialValues[key as keyof T],
      config?.deepCompare,
    ),
  );

  useEffect(() => {
    if (valuesChanged.length) {
      for (const key in values) {
        setInitialValues((s) => ({ ...s, [key]: values[key] }));
      }
    }
  }, [valuesChanged]);

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
  const { state, setState, initialValues } = useFormState(values, config);

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
   * Best used in conjunction with the prebuilt _Input field because it handles blur and change events, but can be used with the default input as well.
   * @example <caption>Usage with _Input:</caption>
   * <_Input ... prop="nameOfProp" onUpdate={onUpdate} />
   *
   * @example <caption>Usage with other components:</caption>
   * <TextInput ... onChange={(event) => onUpdate("nameOfProp", event.nativeEvent.text, false)} onBlur={(event) => onUpdate("nameOfProp", event.nativeEvent.text, true)}
   *  */
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
    return Object.keys(state).some((key) =>
      compareValues(state[key as keyof T], initialValues[key as keyof T]),
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
