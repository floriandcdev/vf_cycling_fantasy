import React from "react";
import { Link } from "react-router-dom";

import "./styles/Navbar.css";

import logoPng from "../medias/png/logo/vf_logo.png";

const Navbar = () => { 

    return(
        <header className="navbar">
            <div className="navbar-desktop">
                <Link to="/" className="navbar-logo">
                    <picture>
                        <img src={logoPng} alt="Logo VF Cycling" loading="eager" width="73" height="53" />
                    </picture>
                </Link>

                <nav aria-label="desktop navigation" className="navbar-center-links">
                    <Link to="/" className="navbar-link">Concept</Link>

                    <div className="navbar-item">
                        <Link to="/profil" className="navbar-link">Mon compte</Link>
                        <div className="sub-menu">
                            <Link to="/mon-equipe" className="sub-menu-link">Mon équipe</Link>
                            <Link to="/mon-classement" className="sub-menu-link">Mon Classement</Link>
                            <Link to="/mes-courses" className="sub-menu-link">Mes courses</Link>
                        </div>
                    </div>

                    <Link to="/calendar" className="navbar-link">Calendrier</Link>
                    <Link to="/quoting" className="navbar-link">Cotation</Link>
                    <Link to="/scale" className="navbar-link">Barème</Link>
                    <Link to="/rules" className="navbar-link">Réglement</Link>
                    <Link to="/FAQ" className="navbar-link">FAQ</Link>
                    <Link to="/logout" className="navbar-link">Déconnexion</Link>
                </nav>
            </div>
        </header>        
    );
}

export default Navbar;