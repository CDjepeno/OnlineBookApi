export type AddUserResponse = {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  created_at?: Date;
  updated_at?: Date;
}

export type AddUserResponseType = {
  message: string;
};

