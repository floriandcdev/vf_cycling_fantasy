import React, { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [userId, setUserId] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const LogIn = useCallback((logInUserId) => {
        setUser(true);
        setUserId(logInUserId)
    }, []);

    const LogOut = useCallback(() => {
        setUser(false);
        setUserId(0);
    }, []);

    return (
        <AuthContext.Provider value={{ user, LogIn, LogOut, isLoading, setIsLoading, userId }}>
            {children}
        </AuthContext.Provider>
    );
};