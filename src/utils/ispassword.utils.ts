export function IsMinLength(str: string, length: number) {
  return str.length >= length;
}

export function IsContainSpecialChar(str: string) {
  const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  return specialCharacterRegex.test(str);
}

export function IsContainNumber(str: string) {
  const numberRegex = /\d/;
  return numberRegex.test(str);
}

export function IsContainUpperChar(str: string) {
  const uppercaseRegex = /[A-Z]/;
  return uppercaseRegex.test(str);
}

export function IsContainLowerChar(str: string) {
  const uppercaseRegex = /[a-z]/;
  return uppercaseRegex.test(str);
}

export default function IsValidPassword(
  str: string,
  minLength = 8,
): {
  check: boolean;
  validated: {
    hasNumber: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasSpecialCharacter: boolean;
    minLength: boolean;
  };
} {
  const validated = {
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialCharacter: false,
    minLength: false,
  };
  if (IsMinLength(str, minLength)) validated.minLength = true;
  if (IsContainNumber(str)) validated.hasNumber = true;
  if (IsContainSpecialChar(str)) validated.hasSpecialCharacter = true;
  if (IsContainUpperChar(str)) validated.hasUpperCase = true;
  if (IsContainLowerChar(str)) validated.hasLowerCase = true;

  return {
    check:
      validated.hasLowerCase &&
      validated.hasNumber &&
      validated.hasSpecialCharacter &&
      validated.hasUpperCase &&
      validated.minLength,
    validated,
  };
}
