import React, { useRef, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavbarContext } from "../NavbarContext";

import "./styles/Navbar.css";

import logoPng from "../medias/png/logo/vf_logo.png";

const Navbar = () => {     
    const menuMobileRef = useRef(null);
    const menuMobileIconRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 699);
    const { navbarActive, setNavbarActive, setScrollPosition } = useContext(NavbarContext);

    const handleNavbarToggle = () => {
        if (!navbarActive) {
            const currentScroll = window.scrollY || document.documentElement.scrollTop;
            setScrollPosition(currentScroll);
        }

        setNavbarActive(!navbarActive);
    }

    const resetNavbar = () => {
        setNavbarActive(false);
        setScrollPosition(0);
    }

    //Events
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 599);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return(
        <header className="navbar">
            {!isMobile ? (
            //Navbar on Desktop
            <div className="navbar-desktop">
                <Link to="/" className="navbar-logo">
                        <img src={logoPng} alt="Logo VF Cycling" className="navbar-logo-image" loading="eager" width="500" height="500" />
                </Link>

                <nav aria-label="desktop navigation" className="navbar-center-links">
                    <Link to="/" className="navbar-link">ACCUEIL</Link>
                    <Link to="/profil" className="navbar-link">MON ÉQUIPE</Link>
                    <Link to="/calendar" className="navbar-link">CALENDRIER</Link>
                    <Link to="/quoting" className="navbar-link">COTATION</Link>
                    <Link to="/scale" className="navbar-link">BARÈME</Link>
                    <Link to="/rules" className="navbar-link">RÉGLEMENT</Link>
                    <Link to="/FAQ" className="navbar-link">FAQ</Link>
                    <Link to="https://www.velofute.com/" className="navbar-link">VÉLOFUTÉ</Link>
                    <Link to="/logout" className="navbar-link">DÉCONNEXION</Link>
                </nav>
            </div>
            ) : (
            <div className="navbar-mobile">
                <div className="navbar-menu-icon" onClick={handleNavbarToggle} ref={menuMobileIconRef}>
                    <svg className={`navbar-hamburger-icon ${navbarActive ? "active" : ""}`} width="100" height="100" viewBox="0 0 100 100">
                        <g filter="url(#a)"><rect width="57" height="9" x="44" y="52" rx="4.5"/><rect width="45" height="9" x="44" y="69" rx="4.5"/><rect width="51" height="9" x="44" y="86" rx="4.5"/></g><defs><filter id="a" width="395" height="343" x="-106" y="-94" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="75"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_450_2451"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_450_2451" result="shape"/></filter></defs>
                    </svg>
                </div>
                <nav aria-label="mobile navigation" className={`navbar-sidebar ${navbarActive ? "active" : ""}`} ref={menuMobileRef} >
                    <Link to="/" className="navbar-sidebar-link" onClick={() => resetNavbar()}>ACCUEIL</Link>
                    <Link to="/profil" className="navbar-sidebar-link" onClick={() => resetNavbar()}>MON ÉQUIPE</Link>
                    <Link to="/calendar" className="navbar-sidebar-link" onClick={() => resetNavbar()}>CALENDRIER</Link>
                    <Link to="/quoting" className="navbar-sidebar-link" onClick={() => resetNavbar()}>COTATION</Link>
                    <Link to="/scale" className="navbar-sidebar-link" onClick={() => resetNavbar()}>BARÈME</Link>
                    <Link to="/rules" className="navbar-sidebar-link" onClick={() => resetNavbar()}>RÉGLEMENT</Link>
                    <Link to="/FAQ" className="navbar-sidebar-link" onClick={() => resetNavbar()}>FAQ</Link>
                    <Link to="/logout" className="navbar-sidebar-link" onClick={() => resetNavbar()}>DÉCONNEXION</Link>
                </nav>
            </div>
            )}
        </header>        
    );
}

export default Navbar;