import { useState, useCallback } from "react";

export default function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    const next = type === "checkbox" ? checked : value;
    setValues((prev) => ({ ...prev, [name]: next }));
  }, []);

  const reset = useCallback(
    (nextValues = initialValues) => {
      setValues(nextValues);
    },
    [initialValues]
  );

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return { values, handleChange, reset, setValue, setValues };
}
