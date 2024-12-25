export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  sexe: string;
};

export type RegisterResponse = {
  email: string;
  name: string;
  phone: string;
};


export type BookingBookFormInput = {
  bookId: number,
  userId: number,
  startAt: string,
  endAt: string
};