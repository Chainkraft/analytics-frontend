import {createContext, ReactElement, useState} from "react";
import {useNavigate} from "react-router-dom";
import {User} from "../../interfaces/users.inteface";

export type AuthContextType = {
    user?: User
    login: (data: User) => void
    logout: () => void
}
const AuthContext = createContext<AuthContextType>({
    login: () => {},
    logout: () => {}
});

export const AuthContextProvider = ({children}: { children: ReactElement }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        let userData = localStorage.getItem("user");
        if (userData) {
            return JSON.parse(userData);
        }
        return null;
    });

    const login = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/");
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;