export type LoginFormInput = {
  email: string;
  password: string;
}

export type VerifyOtpFormInput = {
  email: string;
  otp: string;
}

export type UserFormInput = {
  id?: number
  email: string;
  name: string;
  phone: string;
  sexe: string;
};

export type UserFromData = {
  id?: number
  email: string;
  password?: string;
  confirmPassword?: string;
  name: string;
  phone: string;
  sexe: string;
};