// Generic validators for form fields

export function required(message = 'Bitte ausfüllen') {
  return (value: string | number | boolean) => {
    if (!value) {
      return message;
    }
    return '';
  };
}

export function email(message = 'Ungültige E-Mail-Adresse') {
  return (value: string | number | boolean) => {
    if (!value) {
      return '';
    }
    if (typeof value !== 'string' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return message;
    }
    return '';
  };
}
