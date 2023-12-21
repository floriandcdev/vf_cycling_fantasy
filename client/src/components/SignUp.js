import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import "./styles/SignUp.css";

import signUpBackground from "../medias/png/background/signUp_background.png";

import signInImage from "../medias/png/background/signin_background.png";

const SignUp = () => {
    const [showSignUp, setShowSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [nationality, setNationality] = useState("FRANCE");
    const [knowledge, setKnowledge] = useState("AMATEUR");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiRestCountriesURL = process.env.REACT_APP_REST_COUNTRIES;
    const { LogIn } = useAuth();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/profil");
        }
    }, [user, navigate]);

    const handleStartClick = () => {
        setShowSignUp(true);
    }

    const tooglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleNationalityChange = (event) => {
        setNationality(event.target.value);
    };

    const handleKnowledgeChange = (event) => {
        setKnowledge(event.target.value);
    };

    useEffect(() => {
        fetch(apiRestCountriesURL)
            .then(response => response.json())
            .then(data => {
                const countryOptions = data.map(country => ({
                    name: country.translations.fra.common,
                    code: country.cca2
                }));
                setCountries(countryOptions);
            })
            .catch(error => console.error('Erreur lors de la récupération des pays:', error));
    }, [apiRestCountriesURL]);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            alert("L'adresse email n'est pas valide.");
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Le mot de passe doit contenir au moins 8 caractères, dont des lettres et des chiffres.");
            return;
        }
    
        const userData = { email, password, firstName, lastName, nationality, knowledge};
    
        try {
            const response = await fetch(`${apiUrl}/sign-up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Problème lors de l'enregistrement du compte.");
            }

            LogIn();

            navigate("/choose-league");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert(error.message);
        }
    };

    const renderSignUpForm = () => (
        <div className="sign-up-form-container">
            <img src={signUpBackground} className="sign-up-background" alt="Coureur qui pose" loading="lazy" width="327" height="375" />
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h1 className="sign-up-form-title">Créer votre compte</h1>
                <div className="sign-up-form-row">
                    <div className="sign-up-form-control">
                        <label htmlFor="firstName">PRÉNOM</label>
                        <input id="firstName" type="text" onChange={handleFirstNameChange} required />
                    </div>
                    <div className="sign-up-form-control">
                        <label htmlFor="lastName">NOM DE FAMILLE</label>
                        <input id="lastName" type="text" onChange={handleLastNameChange} required />
                    </div>
                </div>
                <div className="sign-up-form-row">
                    <div className="sign-up-form-control">
                        <label htmlFor="email">EMAIL</label>
                        <input id="email" type="email" value={email} onChange={handleEmailChange} required />
                    </div>
                    <div className="sign-up-form-control">
                        <label htmlFor="nationality">NATIONALITÉ</label>
                        <select id="nationality" onChange={handleNationalityChange}>
                            <option value="france">Sélectionnez une nationalité</option>
                            {
                                countries.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>                              
                            ))}
                        </select>
                    </div>
                </div>
                <div className="sign-up-form-row">
                    <div className="sign-up-form-control">
                        <label htmlFor="knowledge">CONNAISSANCE EN CYCLISME</label>
                        <select id="knowledge"  onChange={handleKnowledgeChange}> 
                            <option value="amateur">Amateur</option>
                            <option value="pro">Professionnel</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>
                    <div className="sign-up-form-control">
                        <label htmlFor="password">MOT DE PASSE</label>
                        <input id="password" type={passwordVisible ? "text" : "password"} value={password} onChange={handlePasswordChange} required />
                        <img src={`${process.env.PUBLIC_URL}/icons/eye.png`} alt="Icone oeil" className="sign-up-form-visibility-icon" width="20" height="20" onClick={tooglePasswordVisibility} />
                    </div>
                </div>
                <div className="sign-up-form-row">
                    <label className="sign-up-form-label-condition">
                        <input type="checkbox" required />
                        J'accepte les <strong>Conditions de Service</strong>
                    </label>
                </div>
                <div className="sign-up-form-row button-row">
                    <button type="submit">S'inscrire</button>
                </div>
            </form>
        </div>
    );

    return (
        <main className="sign-up">
            {!showSignUp ? (
            <div className="sign-up-header">
                <img src={signInImage} alt="Gros plan cycliste en descente" loading="lazy" width="1920" height="1020" />
                <h1 className="sign-up-title">Expérience immersive de gestion cycliste</h1>                
                <div className="sign-up-content">
                    <p>Parcourez le monde d'un simple coup de pédale, et vivez l'expérience ultime de gestion d'équipe cycliste pour des vacances inoubliables</p>
                    <button onClick={handleStartClick}>S'INSCRIRE</button>
                    <p className="sign-up-login-link">
                        Vous avez déjà un compte ? <a href="/login">Se connecter</a>
                    </p>
                </div>
            </div>  
            ) : renderSignUpForm()}          
        </main>
    );
};

export default SignUp;