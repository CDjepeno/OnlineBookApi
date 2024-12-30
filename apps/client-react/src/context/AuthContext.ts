import { createContext } from "react";
import { AuthContextValue } from "../interfaces/auth.context.value";

export const AuthContext = createContext<AuthContextValue | null>(null);
