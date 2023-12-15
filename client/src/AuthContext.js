import React, { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const LogIn = useCallback(() => {
        setUser(true);
    }, []);

    const LogOut = useCallback(() => {
        setUser(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, LogIn, LogOut, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
};