import React, {createContext, useState} from "react";

export const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
    const [navbarActive, setNavbarActive] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    return (
        <NavbarContext.Provider value={{ navbarActive, setNavbarActive, scrollPosition, setScrollPosition }}>
            {children}
        </NavbarContext.Provider>
    );
}