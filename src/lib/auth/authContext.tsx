import { AuthContextType } from "@/types";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    logIn: () => Promise.resolve(),
    logOut: () => Promise.resolve(),
});