import type { ReactNode, Ref } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { ErrorContext } from './ErrorContext.ts';

export default function Form<DataType>({
  children,
  className,
  validators,
  data,
  formRef,
  dataTestId,
  onValidation = () => {

  },
  onSubmit,
}: {
  formRef?: Ref<HTMLFormElement>
  children: ReactNode
  className?: string
  data: DataType
  dataTestId?: string
  validators: Record<keyof DataType, ((value: string | number | boolean | null) => string)[]>
  onValidation?: (errors: Record<keyof DataType, string[]>, triggeredBySubmit?: boolean) => void
  onSubmit: () => Promise<void>
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({} as Record<string, string[]>);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validate = useCallback(
    async (triggeredBySubmit?: boolean) => {
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
          .filter(v => v);
      });
      setErrors(newErrors);
      onValidation(newErrors, triggeredBySubmit);
      if (process.env.NODE_ENV === 'development') {
        console.info('Form errors', newErrors);
      }
      return invalid;
    },
    // eslint-disable-next-line react/exhaustive-deps
    [data],
  );

  useEffect(() => {
    if (submitAttempted) {
      validate();
    }
  }, [validate, submitAttempted]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = await validate(true);

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
    <form ref={formRef} data-testid={dataTestId} onSubmit={submit} className={className}>
      <ErrorContext value={{ errors, setErrors: updateErrors }}>{children}</ErrorContext>
    </form>
  );
}
