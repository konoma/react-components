import type { JSX, Ref } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

export const ErrorContext = createContext<{
  errors: Record<string, string[]>;
  setErrors: (errors: Record<string, string[]>) => void;
}>({
  errors: {} as Record<string, string[]>,
  setErrors: () => {
    return;
  },
});

export default function Form<DataType>({
  children,
  className,
  validators,
  data,
  formRef,
  onValidation = () => {
    return;
  },
  onSubmit,
}: {
  formRef?: Ref<HTMLFormElement>;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  data: DataType;
  validators: Record<keyof DataType, ((value: string | number | boolean | null) => string)[]>;
  onValidation?: (errors: Record<keyof DataType, string[]>) => void;
  onSubmit: () => Promise<void>;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({} as Record<string, string[]>);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validate = useCallback(async () => {
    let invalid = false;
    const newErrors: Record<keyof DataType, string[]> = {} as Record<keyof DataType, string[]>;

    Object.entries(data as Record<string, (string | number | boolean) | null>).forEach(([name, value]) => {
      if (!validators[name as keyof DataType]) {
        return;
      }
      newErrors[name as keyof DataType] = validators[name as keyof DataType]
        .map((validator) => {
          const validation = validator(value);
          if (validation) {
            invalid = true;
          }
          return validation;
        })
        .filter((v) => v);
    });
    setErrors(newErrors);
    onValidation(newErrors);
    if (process.env.NODE_ENV === 'development') {
      console.info('Form errors', newErrors);
    }
    return invalid;
  }, [data]);

  useEffect(() => {
    if (submitAttempted) {
      validate();
    }
  }, [validate, submitAttempted]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = await validate();

    if (invalid) {
      setSubmitAttempted(true);
      return;
    }
    setSubmitAttempted(false);
    await onSubmit();
  }

  function updateErrors(errors: Record<string, string[]>) {
    setErrors(errors);
    onValidation(errors as Record<keyof DataType, string[]>);
  }
  return (
    <form ref={formRef} onSubmit={submit} className={className}>
      <ErrorContext.Provider value={{ errors, setErrors: updateErrors }}>{children}</ErrorContext.Provider>
    </form>
  );
}
