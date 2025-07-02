import { createContext } from "react";
import { AuthContextType } from "../types/user/auth.context.type";

export const AuthContext = createContext<AuthContextType | null>(null);
