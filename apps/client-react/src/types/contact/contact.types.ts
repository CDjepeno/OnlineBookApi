export type AddContactInput = {
  name: string;
  email: string;
  message: string;
};

export type AddContactResponses = {
  message: string;
};

export type ApiContactResponse = {
  data: {
    message: string;
  };
};
