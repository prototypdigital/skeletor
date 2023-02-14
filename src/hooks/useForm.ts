import { useEffect, useState } from "react";

type Validation<T> = { [K in keyof Partial<T>]?: boolean };
type Rules<T> = {
  [K in keyof T]?: (value: T[K], state: T) => boolean | undefined;
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
  const keys = Object.keys(values) as Array<keyof T>;
  const [validation, setValidation] = useState<Validation<T>>({});
  const [initialState, setInitialState] = useState(values);
  const [state, setState] = useState(values);
  const { fieldValidation, stateValidation, isOptional } = useFormUtils(config);

  useEffect(() => {
    const changed = keys.filter((key) => values[key] !== initialState[key]);
    if (!changed.length) {
      return;
    }

    const updatedState = { ...state };
    changed.forEach((key) => (updatedState[key] = values[key]));

    setInitialState({ ...values, ...updatedState });
    setState(updatedState);
  }, [values]);

  /** This function updates the specific property with a new value and validates it if it needs to do so.
   * @example <caption>Usage:</caption>
   * <TextInput ... onChange={(event) => update("nameOfProp", event.nativeEvent.text, false)} onBlur={(event) => update("nameOfProp", event.nativeEvent.text, true)}
   *  */
  function update<K extends keyof T>(
    key: K,
    value: Values<T>[K],
    shouldValidate?: boolean,
  ) {
    setState((s) => ({ ...s, [key]: value }));
    setValidation((s) => ({
      ...s,
      [key]: shouldValidate ? fieldValidation(key, value, state) : undefined,
    }));
  }

  function validate<K extends keyof T>(key: K) {
    setValidation((s) => ({
      ...s,
      [key]: fieldValidation(key, state[key], state),
    }));
  }

  /** Validate entire form, store validation state and return validation value.
   * In human readable terms, use this when you want to validate the form on submit.
   */
  function validateForm(): boolean {
    const formValidationState = stateValidation(state);
    setValidation(formValidationState.validation);
    return formValidationState.valid;
  }

  /** Boolean value of whether the form is valid (ie can be submitted). Use this to disable/enable form submission.
   * Only use when validating fields separately, has no value when valiating on form submit. */
  function isFormValid() {
    return !keys.some((key) =>
      isOptional(key) ? validation[key] === false : !validation[key],
    );
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

  return {
    state,
    validation,
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

/** Helper hook to validate form state outside of the scope of useForm. */
export function useFormUtils<T>(config?: FormConfig<T>) {
  function doesValueExist(value: T[keyof T] | undefined): value is T[keyof T] {
    if (value === null || value === undefined || value === "" || value < 0) {
      return false;
    }
    return true;
  }

  function validateByRule<K extends keyof T>(
    key: K,
    value: T[K],
    state: Values<T>,
  ) {
    // If rule exists, validate with rule
    if (config?.rules && config.rules[key]) {
      return config.rules[key]?.(value, state);
    }
    // else return true because we know the value exists already.
    return true;
  }

  function isOptional(key: keyof T) {
    return config?.optional?.includes(key);
  }

  function fieldValidation(
    key: keyof T,
    value: T[keyof T] | undefined,
    state: Values<T>,
  ) {
    const hasValue = doesValueExist(value);
    const optional = isOptional(key);
    if (!hasValue) {
      return !!optional;
    } else {
      return validateByRule(key, value, state);
    }
  }

  function stateValidation(state: Values<T>) {
    const keys = Object.keys(state).map((key) => key as keyof T);
    const validation: Validation<T> = {};

    keys.forEach((key) => {
      const value = state[key];
      // Force true / false values for entire form. Undefined has no value when submitting.
      validation[key] = fieldValidation(key, value, state) || false;
    });

    return {
      valid: !keys.some((key) => !validation[key]),
      validation,
    };
  }

  return {
    doesValueExist,
    validateByRule,
    isOptional,
    fieldValidation,
    stateValidation,
  };
}
