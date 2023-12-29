import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import "./styles/AskResetPassword.css";

const AskResetPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const { user } = useAuth();
    const [confirmValidDataPopup, setConfirmValidDataPopup] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/profil");
        }
    }, [user, navigate]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            alert("L'adresse email n'est pas valide.");
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/ask-reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
                credentials: "include"
            });

            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message);
            }

            setConfirmValidDataPopup(true);

        } catch (error) {
            alert("Échec de la récupération");
            console.error("Erreur lors de l'enregistrement:", error);
        }
    };

    const handleClosePopup = () => {
        navigate("/");
    };

    return (
        <main className="ask-reset-password">
            {
                confirmValidDataPopup && (
                    <div className="ask-reset-password-popup">
                        <div className="ask-reset-password-popup-content">
                            <p>Un lien de réinitialisation a été envoyé à votre adresse mail.</p>
                            <button onClick={handleClosePopup}>Valider</button>
                        </div>
                    </div>
                )
            }
            <div className="ask-reset-password-form-container">
                <form className="ask-reset-password-form" onSubmit={handleSubmit}>
                    <h1 className="ask-reset-password-form-title">Mot de passe oublié</h1>
                    <p>Veuillez saisir votre adresse électronique ci-dessous et nous vous enverrons votre mot de passe</p>
                    <div className="ask-reset-password-form-input">
                        <input type="email" onChange={handleEmailChange} required />
                    </div>
                    <div className="ask-reset-password-form-row button-row">
                        <button type="submit">Envoyer le code</button>
                    </div>
                </form>
            </div>        
        </main>
    );
};

export default AskResetPassword;