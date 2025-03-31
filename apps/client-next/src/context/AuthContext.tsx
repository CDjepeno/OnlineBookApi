"use client"
import { LoginFormInput, VerifyOtpFormInput } from "@/types/user/input.types";
import { CurrentUserResponse, SigninResponse } from "@/types/user/response.types";
import { createContext, Dispatch, SetStateAction } from "react";


export interface AuthContextValue {
    user: CurrentUserResponse | null;
    signin: (credentials: LoginFormInput) => Promise<SigninResponse>;
    signout: () => Promise<void>;
    verifyOtp: (credentials: VerifyOtpFormInput) => Promise<void>;
    setUser: Dispatch<SetStateAction<CurrentUserResponse | null>>;
  }

export const AuthContext = createContext<AuthContextValue | null>(null);