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
                        <img src={logoPng} alt="Logo VF Cycling" className="navbar-logo-image" loading="eager" width="500" height="500" />
                    </picture>
                </Link>

                <nav aria-label="desktop navigation" className="navbar-center-links">
                    <Link to="/" className="navbar-link">ACCUEIL</Link>
                    <Link to="/profil" className="navbar-link">MON ÉQUIPE</Link>
                    <Link to="/calendar" className="navbar-link">CALENDRIER</Link>
                    <Link to="/quoting" className="navbar-link">COTATION</Link>
                    <Link to="/scale" className="navbar-link">BARÈME</Link>
                    <Link to="/rules" className="navbar-link">RÉGLEMENT</Link>
                    <Link to="/FAQ" className="navbar-link">FAQ</Link>
                    <Link to="/logout" className="navbar-link">DÉCONNEXION</Link>
                </nav>
            </div>
        </header>        
    );
}

export default Navbar;