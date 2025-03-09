export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
};

export type RegisterResponse = {
  email: string;
  name: string;
  phone: string;
};