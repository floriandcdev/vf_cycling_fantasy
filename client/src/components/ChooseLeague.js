import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/ChooseLeague.css";

import tireBannerLeft from "../medias/png/icons/tire_banner_left.png";

const ChooseLeague = () => {
    const navigate = useNavigate();
    const [showCreateLeague, setShowCreateLeague] = useState(false);
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [errorCreateLeague, setErrorCreateLeague] = useState(false);
    const [showJoinLeague, setShowJoinLeague] = useState(false);
    const [leagueId, setLeagueId] = useState("");
    const [joinLeagueExist, setJoinLeagueExist] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleCreateLeague = async () => {
        try {
            const response = await fetch(`${apiUrl}/createLeague`, {
                method: "POST",
                credentials: "include"
            })
            if (response.ok) {
                setShowCreateTeam(true);
                setErrorCreateLeague(false);
                setShowCreateLeague(false);
            } else {
                setErrorCreateLeague(true);
            }
        } catch (error) {
            console.error("Erreur lors de la création de la ligue:", error);
        }
    };

    const handleJoinLeague = async () => {

        try {
            const response = await fetch(`${apiUrl}/joinLeague/${leagueId}`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                navigate(`/create-team/${leagueId}`);
            } else {
                setJoinLeagueExist(false);
            }
        } catch (error) {
            setJoinLeagueExist(false);
            console.error("Erreur lors de la jointure à la ligue:", error);
        }
    };

    return (
        <main className="choose-league">
            <img src={tireBannerLeft} alt="Banderol de pneu" className="choose-league-left-banner" width="60" height="907" />
            <div className="choose-league-title">
                <h1>1 - Je choisis ma ligue</h1>
            </div>
            {!showCreateLeague && !showJoinLeague && (
                <div>
                    <div className="choose-league-choice">
                        <Link className="choose-league-no-link" to="/create-team/0"><h2>World Tour</h2></Link>
                        <Link className="choose-league-no-link" to="/create-team/1"><h2>Néo Pro</h2></Link>
                    </div>
                    <div className="choose-league-choice">
                        <h2 onClick={() => setShowCreateLeague(true)}>Créer ma ligue</h2>
                        <h2 onClick={() => setShowJoinLeague(true)}>Rejoindre une ligue</h2>
                    </div>
                </div>
            )}

            {showCreateLeague && (
                <div className="league-info">
                    <div className="league-create-container">
                        <label htmlFor="leagueName">CHOISIR UN NOM DE LIGUE</label>
                        <input
                            id="leagueName"
                            type="text"
                            value={leagueId}
                            onChange={(e) => setLeagueId(e.target.value)}
                        />
                        <p>Le nom doit faire 5 caractères minimum</p>
                        <span>Le nom doit comporter au moins une majuscule et un chiffre</span>
                        {errorCreateLeague && (
                            <div>
                                <span>Le nom de la ligue est incorrect ou déjà existant.</span>
                            </div>
                        )}
                        <button onClick={() => handleCreateLeague()}>Je crée ma ligue</button>
                    </div>
                </div>
            )}

            {showCreateTeam && (
                <div>
                    <Link className="choose-league-create-no-link" to={`/create-team/${leagueId}`}><button className="choose-league-create-team-button">Créer mon équipe</button></Link>
                </div>
            )}

            {showJoinLeague && (
                <div className="league-join">
                    <div className="league-join-input">
                        <input
                            type="text"
                            value={leagueId}
                            onChange={(e) => setLeagueId(e.target.value)}
                            placeholder="Nom de la ligue"
                        />
                        <button onClick={handleJoinLeague}>Rejoindre</button>
                    </div>
                    {!joinLeagueExist && (
                        <div className="leahue-join-no-exist">
                            <p>La ligue n'existe pas</p>
                        </div>
                    )}
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