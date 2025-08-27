// Email validation using a well-known regex pattern
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Password validation: at least one lowercase, uppercase, digit, and symbol
export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-])[A-Za-z\d@$!%*?&.\-]/;
  return passwordRegex.test(password) && password.length >= 8;
};

// Phone number validation: exactly 10 digits
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Password confirmation validation
export const doPasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword && password.length > 0;
};

// Validation error messages
export const getValidationErrorMessage = (
  field: string,
  value: string,
  confirmPassword?: string
): string | null => {
  switch (field) {
    case "email":
      if (!value) return "Email is required";
      if (!isValidEmail(value)) return "Please enter a valid email address";
      return null;

    case "password":
      if (!value) return "Password is required";
      if (!isValidPassword(value))
        return "Password must contain at least 8 characters with uppercase, lowercase, digit, and symbol";
      return null;

    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (confirmPassword && !doPasswordsMatch(confirmPassword, value))
        return "Passwords do not match";
      return null;

    case "contactNumber":
      if (!value) return "Contact number is required";
      if (!isValidPhoneNumber(value))
        return "Contact number must be exactly 10 digits";
      return null;

    case "fullName":
      if (!value || value.trim().length === 0) return "Full name is required";
      return null;

    default:
      return null;
  }
};

// Complete form validation for signup
export const validateSignupForm = (formData: {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const fullNameError = getValidationErrorMessage(
    "fullName",
    formData.fullName
  );
  if (fullNameError) errors.fullName = fullNameError;

  const emailError = getValidationErrorMessage("email", formData.email);
  if (emailError) errors.email = emailError;

  const contactError = getValidationErrorMessage(
    "contactNumber",
    formData.contactNumber
  );
  if (contactError) errors.contactNumber = contactError;

  const passwordError = getValidationErrorMessage(
    "password",
    formData.password
  );
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = getValidationErrorMessage(
    "confirmPassword",
    formData.confirmPassword,
    formData.password
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Complete form validation for login
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const emailError = getValidationErrorMessage("email", formData.email);
  if (emailError) errors.email = emailError;

  if (!formData.password) errors.password = "Password is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
