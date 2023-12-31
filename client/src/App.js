import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useAuth } from "./AuthContext";
import ProtectedRoutes from "./ProtectedRoutes";
import { NavbarProvider } from ".//NavbarContext";
import ReactGA from "react-ga4";
import { Helmet } from "react-helmet";

import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Calendar from "./components/Calendar";
import Quoting from "./components/Quoting";
import Scale from "./components/Scale";
import Rules from "./components/Rules";
import Faq from "./components/Faq";
import ShowRaceDetail from "./components/ShowRaceDetail";
import SignUp from "./components/SignUp";
import LogInComponent from "./components/LogIn";
import LogOutComponent from "./components/LogOut";
import AskResetPassword from "./components/AskResetPassword";
import ResetPassword from "./components/ResetPassword";

import AdComponent from "./components/AdComponent";

function App() {
    const { LogIn, LogOut, setIsLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    React.useEffect(() => {
        ReactGA.initialize([
        {
            trackingId: "G-TXVML1BFN2"
          },  
        ]);
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
      }, []);
    

    useEffect(() => {
        setIsLoading(true);
        const verifySession = async () => {
            try {
                const response = await fetch(`${apiUrl}/verify-session`, {
                    credentials: "include"
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Session non valide ou expirée");
                }
                
                const userId = data.userId;
                LogIn(userId);
                
            } catch (error) {
                console.error("Erreur de vérification de session:", error);
                LogOut();
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [LogIn, LogOut, apiUrl, setIsLoading]);

  return (
    <div>
        <Helmet>
            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1359392757710017"
                crossorigin="anonymous"
            ></script>
        </Helmet>
        <NavbarProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />                 
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/quoting" element={<Quoting />} />
                <Route path="/scale" element={<Scale />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogInComponent />} />
                <Route path="/logout" element={<LogOutComponent />} />
                <Route path="/ask-reset-password" element={<AskResetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/show-race-detail/:idRace" element={<ShowRaceDetail />} />

                <Route path="/*" element={<ProtectedRoutes />} />

            </Routes>
            <AdComponent adSlot="4487061181" />
        </Router>
        </NavbarProvider>
    </div>
  );
}

export default App;