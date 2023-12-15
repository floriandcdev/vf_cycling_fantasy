import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const LogOut = () => {
    const navigate = useNavigate();
    const { LogOut } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/log-out`, {
            method: "POST",
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                LogOut();
                navigate("/");
            } else {
                LogOut();
                throw new Error("Problème lors de la déconnexion.");
            }
        })
        .catch(error => {
            LogOut();
            console.error("Erreur lors de la déconnexion:", error);
        });
    }, [LogOut, navigate, apiUrl]);

    return (
        <div>Vous êtes déconnecté</div>
    );
};

export default LogOut;