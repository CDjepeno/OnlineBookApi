import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { MethodHttpEnum } from "../enum/enum";
import { UseRequestApi } from "../request/commons/useApiRequest";
import { LOGIN_ROUTE } from "../request/route-http/route-http";
import { getCurrentUser } from "../services/user.services";
import { AuthFormInput } from "../types/user/input.types";
import {
  CurrentUserResponse,
  SigninResponse,
} from "../types/user/response.types";

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
      console.error("Error getting current user:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("BookToken");
    if (storedToken) {
      getUser();
    }
  }, []);

  const signin = async (credentials: AuthFormInput) => {
    const response = await UseRequestApi<SigninResponse, unknown>({
      method: MethodHttpEnum.POST,
      path: LOGIN_ROUTE,
      params: credentials,
      includeAuthorizationHeader: false,
    });

    if (response && response.token) {
      const token = response.token;
      localStorage.setItem("BookToken", JSON.stringify(token));
      await getUser();
    }
  };

  const signout = async () => {
    localStorage.removeItem("BookToken");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
