// Generic validators for form fields

export function required(message: string) {
  return (value: string | number | boolean | null) => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    return '';
  };
}

export function email(message: string) {
  return (value: string | number | boolean | null) => {
    if (!value) {
      return '';
    }
    if (typeof value !== 'string' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return message;
    }
    return '';
  };
}
