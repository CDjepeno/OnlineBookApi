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
import Cookies from "js-cookie";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const router = useRouter(); // Remplace useNavigate

  const getUser = async () => {
    try {
      const token = localStorage.getItem("BookToken");
      const tokenCookies = Cookies.get("BookTokenCookies");

      if (!token || !tokenCookies) {
        setUser(null);
        return;
      }
      
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      console.error("Error getting current user:", error);
    }
  };

  useEffect(() => {
    // Vérifie le token côté client uniquement
      const token = localStorage.getItem("BookToken");
      const tokenCookies = Cookies.get("BookTokenCookies");
      if (token || tokenCookies) {
        getUser();
    }
  }, [user]);

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
        Cookies.set("BookTokenCookies", token, { expires: 7 }); // Stocke le token dans un cookie
        Cookies.set("BookRefreshTokenCookies", refreshToken, { expires: 7 }); // Stocke le token dans un cookie
      }
      
      const user = await getCurrentUser()
      setUser(user);
      console.log(user);
      
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
      Cookies.remove("BookTokenCookies")
      Cookies.remove("BookRefreshTokenCookies")
    }
    setUser(null);
    router.push("/"); 
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, verifyOtp, setUser, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
