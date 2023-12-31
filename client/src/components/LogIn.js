import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import "./styles/LogIn.css";

import tireBannerDown from "../medias/png/icons/tire_banner_down.png";
import tireBannerUp from "../medias/png/icons/tire_banner_up.png";

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { LogIn } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;   
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/profil");
        }
    }, [user, navigate]);
    
    const tooglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            alert("L'adresse email n'est pas valide.");
            return;
        }

        const userData = { email, password };
    
        try {
            const response = await fetch(`${apiUrl}/log-in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Problème lors de la connexion.");
            }            

            console.log("Login data:",data);

            const userId = data.userId;
            LogIn(userId);

            navigate("/profil");
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            alert(error.message);
        }
    };

    return (
        <main className="login">
            <h1>Connexion</h1>
            <img src={tireBannerDown} alt="Banderol de pneu" className="login-left-banner" width="606" height="714" />
            <img src={tireBannerUp} alt="Banderol de pneu" className="login-right-banner" width="526" height="707" />
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-form-control">
                    <label htmlFor="email">Email</label>
                    <img src={`${process.env.PUBLIC_URL}/icons/user.png`} alt="Icone user" className="login-icon" width="24" height="24" />
                    <input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className="login-form-control">
                    <label htmlFor="password">Mot de passe</label>
                    <img src={`${process.env.PUBLIC_URL}/icons/lock.png`} alt="Icone cadenas" className="login-icon" width="24" height="24" />
                    <input 
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <img src={`${process.env.PUBLIC_URL}/icons/eye.png`} alt="Icone oeil" className="login-form-visibility-icon" width="20" height="20" onClick={tooglePasswordVisibility} />
                </div>
                <div className="login-form-options">
                    <label className="login-remember-me">
                        <input type="checkbox" name="remember" />
                        Se souvenir de moi
                    </label>
                    <a href="/ask-reset-password" className="login-forgot-password">Mot de passe oublié ?</a>
                </div>
                <div className="login-button-container">
                    <button type="submit" className="login-button">SE CONNECTER</button>
                </div>
            </form>
            <a href="/signup" className="login-forgot-password">Pas encore inscrit ? Créez votre compte.</a>
        </main>
    );
};

export default LogIn;