export type AuthFormInput = {
  email: string;
  password: string;
};

export type GoogleLoginInput = {
  idToken: string;
  email?: string;
  name?: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
  phone: string;
};
