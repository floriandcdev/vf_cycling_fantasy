import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/ChooseLeague.css";

import tireBannerLeft from "../medias/png/icons/tire_banner_left.png";
import chooseLeagueBackground from "../medias/png/background/choose_league_background.png";
import worldTourBackground from "../medias/png/background/world_tour_background.png";
import neoProBackground from "../medias/png/background/neo_pro_background.png";

const ChooseLeague = () => {
    const [showCreateLeague, setShowCreateLeague] = useState(false);
    const [showJoinLeague, setShowJoinLeague] = useState(false);
    const [showChooseTeam, setShowChooseTeam] = useState(false);
    const [errorCreateLeague, setErrorCreateLeague] = useState(false);    
    const [leagueId, setLeagueId] = useState("");
    const [leagueLabel, setLeagueLabel] = useState("");
    const [joinLeagueExist, setJoinLeagueExist] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleCreateLeague = async () => {
        try {
            const response = await fetch(`${apiUrl}/createLeague/${leagueLabel}`, {
                method: "POST",
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json();

                if (data.league && data.league.leagueId) {
                    setShowCreateLeague(false);
                    setShowChooseTeam(true);
                    setLeagueId(data.league.leagueId);
                } else {
                    setErrorCreateLeague(true);
                }                
            } else {
                setErrorCreateLeague(true);
            }
        } catch (error) {
            console.error("Erreur lors de la création de la ligue:", error);
        }
    };

    const handleJoinLeague = async () => {
        try {
            const response = await fetch(`${apiUrl}/joinLeague/${leagueLabel}`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                if (data.league && data.league.leagueId) {
                    setShowJoinLeague(false);
                    setShowChooseTeam(true);        
                    setLeagueId(data.league.leagueId);          
                } else {
                    setJoinLeagueExist(false);
                }
            } else {
                setJoinLeagueExist(false);
            }
        } catch (error) {
            setJoinLeagueExist(false);
            console.error("Erreur lors de la jointure à la ligue:", error);
        }
    };

    const handleJoinGeneralLeague = () => {
        setShowChooseTeam(true);
        setLeagueId(1);
    };

    return (
        <main className="choose-league">
            <div className="choose-league-left-banner" style={{ backgroundImage: `url(${tireBannerLeft})` }}></div>
            <div className="choose-league-shadow-container">
                <div className="choose-league-title">
                    <h1>{showChooseTeam ? "CRÉER SON ÉQUIPE - MODE DE JEU" : "CHOISISSEZ VOTRE LIGUE"}</h1>
                </div>
                <div className="choose-league-shadow-mask-right"></div>
                <div className="choose-league-shadow-mask-bottom"></div>
            </div>

            {!showCreateLeague && !showJoinLeague && !showChooseTeam && (
                <div className="choose-league-body">
                    <div className="choose-league-choice">
                        <h2 onClick={() => setShowCreateLeague(true)}>CRÉER MA LIGUE</h2>
                        <h2 onClick={() => setShowJoinLeague(true)}>REJOINDRE UNE LIGUE</h2>
                        <h2 onClick={() => handleJoinGeneralLeague()}>REJOINDRE LA LIGUE GÉNÉRAL</h2>
                    </div>
                    <img src={chooseLeagueBackground} alt="Visuel de classement" loading="lazy"/>
                </div>
            )}

            {showCreateLeague && (
                <div className="choose-league-info">
                    <div className="choose-league-create-container">
                        <label htmlFor="leagueName">CHOISIR UN NOM DE LIGUE</label>
                        <input
                            id="leagueName"
                            type="text"
                            value={leagueLabel}
                            onChange={(e) => setLeagueLabel(e.target.value)}
                        />
                        <p>Le nom doit faire 5 caractères minimum</p>
                        <span>Le nom doit comporter au moins une majuscule et un chiffre</span>
                        {errorCreateLeague && (
                            <div>
                                <span>Le nom de la ligue est incorrect ou déjà existant.</span>
                            </div>
                        )}
                        <button onClick={() => handleCreateLeague()}>JE CRÉE MA LIGUE</button>
                    </div>
                </div>
            )}

            {showJoinLeague && (
                <div className="choose-league-join">
                    <div className="choose-league-join-input">
                        <input
                            type="text"
                            value={leagueLabel}
                            onChange={(e) => setLeagueLabel(e.target.value)}
                            placeholder="Nom de la ligue"
                        />
                        <button onClick={handleJoinLeague}>REJOINDRE</button>
                    </div>
                    {!joinLeagueExist && (
                        <div className="choose-league-join-no-exist">
                            <p>La ligue n'existe pas</p>
                        </div>
                    )}
                </div>
            )}

            {showChooseTeam && (
                <div className="choose-league-choose-team">
                    <div className="choose-league-choose-team-left-container">
                        <img src={worldTourBackground} alt="Cycliste qui célèbre une victoire" width="612" height="344" loading="lazy" />
                        <Link className="choose-league-choose-team-title" to={`/create-team/${leagueId}/1`}>WORLD TOUR</Link>
                    </div>
                    <div className="choose-league-choose-team-right-container">
                        <img src={neoProBackground} alt="Jeune cycliste" width="612" height="408" loading="lazy" />
                        <Link className="choose-league-choose-team-title" to={`/create-team/${leagueId}/2`}>NÉO PRO</Link>
                    </div>
                </div>
            )}

            <div className="choose-league-rules">
                <p><strong>Je crée ma ligue : </strong>Vous êtes prêt à créer votre propre Tour de Chatpéton ?  Lancez votre ligue et défiez vos amis à une course effrénée vers la victoire !</p>
                <p><strong>Je rejoins mes amis : </strong>Félicitations, vous avez reçu votre sésame pour rejoindre vos amis dans cette aventure cycliste virtuelle !</p>
            </div>
        </main>
    );
};

export default ChooseLeague;
