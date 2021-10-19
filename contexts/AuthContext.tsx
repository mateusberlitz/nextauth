import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

interface User{
    email: string;
    permissions: string[];
    roles: string[];
}

interface SignInCredentials{
    email: string;
    password: string;
}

interface AuthContextData {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    user: User;
};

interface AuthProviderProps{
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    async function signIn({email, password}: SignInCredentials){
        try{
            const response = await api.post('sessions', {
                email,
                password
            });

            const { token, refreshToken, permissions, roles } = response.data;

            setUser({
                email,
                permissions,
                roles
            });

            router.push('/dashboard');
        }catch(error){
            console.log(error);
        }
    }

    return(
        <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}