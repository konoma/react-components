// Generic validators for form fields

export function required(message: string) {
  return (value: string | number | boolean | null | Record<string, string | number | boolean | null>) => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    return '';
  };
}

export function email(message: string) {
  return (value: string | number | boolean | null | Record<string, string | number | boolean | null>) => {
    if (!value) {
      return '';
    }
    if (typeof value !== 'string' || !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
      return message;
    }
    return '';
  };
}
