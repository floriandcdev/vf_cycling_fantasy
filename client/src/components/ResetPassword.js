import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./styles/ResetPassword.css";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [confirmValidDataPopup, setConfirmValidDataPopup] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Le mot de passe doit contenir au moins 8 caractères, dont des lettres et des chiffres.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la réinitialisation du mot de passe.");
            }

            setConfirmValidDataPopup(true);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert(error.message);
        }        
    };

    const handleClosePopup = () => {
        navigate("/login");
    };

    return (
        <main className="reset-password">
            {
                confirmValidDataPopup && (
                    <div className="reset-password-popup">
                        <div className="reset-password-popup-content">
                            <p>Le changement de votre mot de passe a bien été effectué.</p>
                            <button onClick={handleClosePopup}>Valider</button>
                        </div>
                    </div>
                )
            }
            <div className="reset-password-form-container">
                <form className="reset-password-form" onSubmit={handleSubmit}>
                    <h1 className="reset-password-form-title">Réinitialiser le mot de passe</h1>
                    <div className="reset-password-form-input">
                        <label htmlFor="newPassword">Nouveau mot de passe:</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="reset-password-form-input">
                        <label htmlFor="confirmPassword">Confirmez le mot de passe:</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="reset-password-form-row button-row">
                        <button type="submit">Réinitialiser le mot de passe</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ResetPassword;