import { LoginFormInput } from "../types/user/input.types";
import { CurrentUserResponse } from "../types/user/response.types";

export interface AuthContextValue {
  user: CurrentUserResponse | null;
  signin: (credentials: LoginFormInput) => Promise<void>;
  signout: () => Promise<void>;
}
