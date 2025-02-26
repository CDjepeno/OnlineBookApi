import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useApiRequest";
import {
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  VERIFY_OTP_ROUTE,
} from "../request/route-http/route-http";
import { getCurrentUser } from "../services/user.services";
import {
  CurrentUserResponse,
  SigninResponse,
  VerifyOtpResponse,
} from "../types/user/response.types";
import { LoginFormInput, VerifyOtpFormInput } from "src/types/user/input.types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const navigate = useNavigate();

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
    // Vérifiez le token dans localStorage au chargement
    const token = localStorage.getItem("BookToken");
    if (token) {
      getUser();
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
      localStorage.setItem("BookToken", JSON.stringify(token));
      localStorage.setItem("RefreshToken", JSON.stringify(refreshToken));
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
    localStorage.removeItem("BookToken");
    localStorage.removeItem("RefreshToken");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};
