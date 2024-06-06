import * as React from 'react'
import { AuthContextType, UserType } from './types/user.type'
import UseUserStore from './store/user.store'
import { createContext, useState } from 'react'
import { ApiAuth } from '@/lib/auth';

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    logIn: () => { },
    logOut: () => Promise.resolve(),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const userState = UseUserStore();
    const persistedUser = userState ? userState.user : null;
    const [user, setUser] = useState<UserType | null>(persistedUser);


    const logOut = async () => {
        return ApiAuth.logout();
    }

    const logIn = (data: UserType) => {
        userState.saveUser(data)
        setUser(data);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}