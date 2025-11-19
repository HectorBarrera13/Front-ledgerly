export const PASSWORD_MIN_LENGTH = 8;
export const PHONE_MIN_LENGTH = 7;
export const PHONE_MAX_LENGTH = 15;
export const NAME_MIN_LENGTH = 2;

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isNotEmpty = (value: string) =>
  value != null && value.trim().length > 0;

export const isValidPassword = (password: string, minLength = PASSWORD_MIN_LENGTH) =>
  typeof password === "string" && password.length >= minLength;

export const isValidPhone = (phone: string) =>
  new RegExp(`^\\+?\\d{${PHONE_MIN_LENGTH},${PHONE_MAX_LENGTH}}$`).test(phone.replace(/\s/g, ""));

export const isValidName = (name: string, minLength = NAME_MIN_LENGTH) =>
  new RegExp(`^[a-zA-ZÀ-ÿ\\s'-]{${minLength},}$`).test(name.trim());

export const isValidCountry = (country: string) =>
  isNotEmpty(country);

export const isValidPolicyAccepted = (accepted: boolean) =>
  accepted === true;