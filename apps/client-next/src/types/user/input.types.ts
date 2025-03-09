export type LoginFormInput = {
  email: string;
  password: string;
}

export type VerifyOtpFormInput = {
  email: string;
  otp: string;
}

export type RegisterFormInput = {
  id?: number
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  sexe: string;
};

export type UpdateUserInput = {
  id?: number
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  sexe: string;
};