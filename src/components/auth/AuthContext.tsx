import {createContext, ReactElement, useState} from "react";
import {User} from "../../interfaces/users.inteface";
import jwt_decode from "jwt-decode";

export type AuthContextType = {
    user?: User
    login: (data: User, token: string) => void
    logout: () => void
}
const AuthContext = createContext<AuthContextType>({
    login: () => {},
    logout: () => {}
});

export const AuthContextProvider = ({children}: { children: ReactElement }) => {

    const [user, setUser] = useState(() => {
        const expiresIn = localStorage.getItem("expiresIn");
        if (expiresIn === null || parseInt(expiresIn) * 1000 > new Date().getTime()) {
            const userData = localStorage.getItem("user");
            if (userData) {
                return JSON.parse(userData);
            }
        }
        return null;
    });

    const login = (user: User, token: string) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("expiresIn", jwt_decode<any>(token).exp);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("expiresIn");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;