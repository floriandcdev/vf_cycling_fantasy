import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/HomePage.css";

import homeBackground from "../medias/png/background/home_background.png";
import homeBackgroundMobile from "../medias/png/background/home_background_mobile.png";
import homeCyclistZoom from "../medias/png/background/home_cyclist_zoom.png";
import homeBikeZoom from "../medias/png/background/home_bike_zoom.png";

const HomePage = () => {
    const [isMobile] = useState(window.innerWidth <= 699);

    return (
        <main className="home">
            <section className="home-section1">
                <div className="home-section1-background">
                    <img src={isMobile ? homeBackgroundMobile : homeBackground} className="home-section1-background-image" alt="Gros plan cycliste" loading="lazy" width="1919" height="400" />
                </div>
            </section>

            <section className="home-section2">
                <div className="home-section2-left-container">
                    <div className="home-section2-text-content">
                        <h1>Bienvenue sur l'Épopée</h1>
                        <h2>Un jeu de Cycling Fantasy par Vélofuté</h2>
                        <p>Plongez dans l'univers captivant du cyclisme avec notre jeu interactif de gestion d'équipe en ligne !</p>
                        <Link to="/signup">
                            <button className="home-section2-button">JE M'INSCRIS</button>
                        </Link>
                    </div>
                </div>
                <div className="home-section2-right-container">
                    <img src={homeCyclistZoom} alt="Gros plan sur cycliste" className="home-section2-right-image" loading="lazy" width="367" height="493"/>
                </div>
            </section>

            <section className="home-section3">
                <img className="home-section3-background" src={homeBikeZoom} alt="Zoom sur un vélo" width="1920" height="225" loading="lazy" />
                <h2 className="home-section3-title">Pourquoi rejoindre l'Épopée VF</h2>
                <div className="home-section3-vignettes-container">
                    <div className="home-section3-left-vignette">
                        <h3>Créez votre équipe de rêve</h3>
                        <p>Sélectionnez parmi l’ensemble des coureurs World Teams et Pro Teams. Pour composer votre équipe de rêve pour 500M.</p>
                    </div>
                    <div className="home-section3-center-vignette">
                        <h3>Stratégie et astuce</h3>
                        <p>Choisissez votre calendrier, vos objectifs selon vos choix de coureurs.</p>
                        <p>Gérez astucieusement vos 5 transferts durant les périodes d’échanges.</p>
                    </div>
                    <div className="home-section3-right-vignette">
                        <h3>Participez à des ligues passionnantes</h3>
                        <p>Créez votre propre ligue ou rejoignez une ligue déjà créée.</p>
                        <p>Devancez vos amis et l’ensemble des joueurs au classement général.</p>
                    </div>
                </div>
            </section>       
        </main>
    );
}

export default HomePage;