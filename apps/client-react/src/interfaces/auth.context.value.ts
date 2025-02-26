import { LoginFormInput, VerifyOtpFormInput } from "../types/user/input.types";
import { CurrentUserResponse, SigninResponse } from "../types/user/response.types";

export interface AuthContextValue {
  user: CurrentUserResponse | null;
  signin: (credentials: LoginFormInput) => Promise<SigninResponse>;
  signout: () => Promise<void>;
  verifyOtp: (credentials: VerifyOtpFormInput) => Promise<void>;
}
