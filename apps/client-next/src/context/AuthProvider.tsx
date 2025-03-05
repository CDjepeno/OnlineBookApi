'use client'

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Remplace useNavigate
import { AuthContext } from "./AuthContext";
import { UseRequestApi } from "../request/commons/useApiRequest";
import {
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  VERIFY_OTP_ROUTE,
} from "../request/route-http/route-http";
import {
  CurrentUserResponse,
  SigninResponse,
  VerifyOtpResponse,
} from "../types/user/response.types";
import { LoginFormInput, VerifyOtpFormInput } from "@/types/user/input.types";
import { MethodHttpEnum } from "@/types/enum/enum";
import { getCurrentUser } from "@/services/user.services";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const router = useRouter(); // Remplace useNavigate

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      console.error("Error getting current user:", error);
    }
  };

  useEffect(() => {
    // Vérifie le token côté client uniquement
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("BookToken");
      if (token) {
        getUser();
      }
    }
  }, []);

  const signin = async (credentials: LoginFormInput) => {
    return await UseRequestApi<SigninResponse, unknown>({
      method: MethodHttpEnum.POST,
      path: LOGIN_ROUTE,
      params: credentials,
      includeAuthorizationHeader: false,
    });
  };

  const verifyOtp = async (credentials: VerifyOtpFormInput) => {
    const response = await UseRequestApi<VerifyOtpResponse, unknown>({
      method: MethodHttpEnum.POST,
      path: VERIFY_OTP_ROUTE,
      params: credentials,
      includeAuthorizationHeader: false,
    });

    if (response && response.token && response.refreshToken) {
      const token = response.token;
      const refreshToken = response.refreshToken;
      if (typeof window !== "undefined") {
        localStorage.setItem("BookToken", JSON.stringify(token));
        localStorage.setItem("RefreshToken", JSON.stringify(refreshToken));
      }
      await getUser();
    }
  };

  const signout = async () => {
    await UseRequestApi<unknown, unknown>({
      method: MethodHttpEnum.POST,
      path: LOGOUT_ROUTE,
      params: { id: user?.id },
      includeAuthorizationHeader: false,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("BookToken");
      localStorage.removeItem("RefreshToken");
    }
    setUser(null);
    router.push("/"); // Remplace navigate("/")
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};
