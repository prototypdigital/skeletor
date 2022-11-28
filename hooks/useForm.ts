import { useState } from "react";

type Validation<T> = { [K in keyof Partial<T>]?: boolean };
type Rules<T> = {
  [K in keyof T]?: (value: T[K]) => boolean | undefined;
};

type Values<T> = {
  [K in keyof T]: T[K];
};

export type FormConfig<R> = {
  /** List of optional properties. Optional properties will be marked as valid if left empty. */
  optional?: Array<keyof R>;
  /** Validation rules by specified property name. If you define a validation rule function here, the field will be validated against it. If no rule is set, a crude value check will be used instead (Boolean(value)) */
  rules?: Rules<R>;
  /** Will compare key/value pairs instead of just top level JSON.stringify on complex objects/arrays */
  deepCompare?: boolean;
  logging?: boolean;
};

/** One-fits-all solution to manage state changes, field validation and optional entries within a form.
 * @example <caption>Simple use case:</caption>
 *  const { state, validation, update } = useForm({ email: '', password: '', });
 *
 *
 * @example <caption>For more complex form states (ie one field can be of multiple types), you should pass the form's type:</caption>
 * const { state, validation, update } = useForm<{ numericOrUndefined: number | undefined }>({ numericOrUndefined: undefined }, { rules: { numericOrUndefined: (value: number | undefined): boolean | undefined => ... }});
 *
 */
export function useForm<T>(values: Values<T>, config?: FormConfig<T>) {
  const { logging = false, deepCompare = false } = config || {};
  const keys = Object.keys(values) as Array<keyof T>;
  const [validation, setValidation] = useState<Validation<T>>({});
  const [initialState, setInitialState] = useState({ ...values });
  const [state, setState] = useState({ ...values });

  function compareValues(
    value: Values<T>[keyof T],
    previousValue: Values<T>[keyof T],
  ): boolean {
    // Fallback for date handling (Date object causes constant changes for some reason)
    if (value instanceof Date && previousValue instanceof Date) {
      return value.toISOString() !== previousValue.toISOString();
    }

    // Very crudely handle object type changes. Could be performance intensive based on the size of the object.
    if (value instanceof Object && previousValue instanceof Object) {
      if (!deepCompare) {
        const valueString = JSON.stringify({ ...value });
        const previousValueString = JSON.stringify({ ...previousValue });
        return valueString !== previousValueString;
      }

      if (Array.isArray(value) && Array.isArray(previousValue)) {
        if (value.length !== previousValue.length) {
          return true;
        }

        return value.some((item, index) =>
          compareValues(item, previousValue[index]),
        );
      }

      // Very crudely handle object type changes. Could be performance intensive based on the size of the object.

      return Object.keys(value as Object).some((key) =>
        compareValues((value as any)[key], (previousValue as any)[key]),
      );
    }

    return value !== previousValue;
  }

  function doesValueExist(value: T[keyof T] | undefined): value is T[keyof T] {
    if (value === null || value === undefined || value === "" || value < 0)
      return false;
    return true;
  }

  /** Check if state has value for key */
  function doesKeyValueExist(key: keyof T) {
    const value = state[key];
    return doesValueExist(value);
  }

  function validateByRule<K extends keyof T>(key: K, value: T[K]) {
    // If rule exists, validate with rule
    if (config?.rules && config.rules[key]) return config.rules[key]?.(value);
    // else return true because we know the value exists already.
    return true;
  }

  function isOptional(key: keyof T) {
    return config?.optional?.includes(key);
  }

  function fieldValidation(key: keyof T, value: T[keyof T] | undefined) {
    const hasValue = doesValueExist(value);
    const optional = isOptional(key);
    if (!hasValue) {
      return !!optional;
    } else {
      return validateByRule(key, value);
    }
  }

  /** Validate entire form, store validation state and return validation value.
   * In human readable terms, use this when you want to validate the form on submit.
   */
  function validateForm(): boolean {
    const _map: Validation<T> = {};

    keys.forEach((key) => {
      const value = state[key];
      // Force true / false values for entire form. Undefined has no value when submitting.
      _map[key] = fieldValidation(key, value) || false;
    });

    setValidation(_map);

    return !keys.some((key) => !_map[key]);
  }

  /** This function updates the specific property with a new value and validates it if it needs to do so.
   * @example <caption>Usage:</caption>
   * <TextInput ... onChange={(event) => update("nameOfProp", event.nativeEvent.text, false)} onBlur={(event) => update("nameOfProp", event.nativeEvent.text, true)}
   *  */
  function update<K extends keyof T>(
    key: K,
    value: Values<T>[K],
    validate?: boolean,
  ) {
    setState((s) => ({ ...s, [key]: value }));
    setValidation((s) => ({
      ...s,
      [key]: validate ? fieldValidation(key, value) : undefined,
    }));
  }

  function validate<K extends keyof T>(key: K) {
    setValidation((s) => ({ ...s, [key]: fieldValidation(key, state[key]) }));
  }

  /** Boolean value of whether the form is valid (ie can be submitted). Use this to disable/enable form submission.
   * Only use when validating fields separately, has no value when valiating on form submit. */
  function isFormValid() {
    return !keys.some((key) =>
      isOptional(key) ? validation[key] === false : !validation[key],
    );
  }

  /** Boolean value of whether the form has changed from it's initially set values. */
  function hasChanged() {
    const changed = keys.filter((key) =>
      compareValues(state[key], initialState[key]),
    );
    if (logging && changed.length)
      console.log("Changed values: ", changed.join(", "));
    return Boolean(changed.length);
  }

  /** Resets changed values to initial state */
  function resetState() {
    setState(values);
  }

  /** Re-initializes initial state from currently passed values. Use this if you need to reinitialize the form after the source values change, i.e. if a different state object comes into play after submitting the form (such as reducer data or API endpoint response data) */
  function resetInitialValues() {
    setInitialState(values);
  }

  /** Resets validation to initial state. */
  function resetValidation() {
    setValidation({});
  }

  /** Resets entire form, state and validation included */
  function clearForm() {
    resetInitialValues();
    resetState();
    resetValidation();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(resetValidation, []);

  return {
    state,
    validation,
    hasChanged,
    update,
    validate,
    validateForm,
    isFormValid,
    clearForm,
    resetState,
    resetValidation,
    resetInitialValues,
  };
}
