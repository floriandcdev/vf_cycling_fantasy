import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/ChooseLeague.css";

import tireBannerLeft from "../medias/png/icons/tire_banner_left.png";

const ChooseLeague = () => {
    const navigate = useNavigate();
    const [showCreateLeague, setShowCreateLeague] = useState(false);
    const [showJoinLeague, setShowJoinLeague] = useState(false);
    const [leagueId, setLeagueId] = useState(null);
    const [inputLeagueId, setInputLeagueId] = useState("");
    const [joinLeagueExist, setJoinLeagueExist] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleCreateLeague = async () => {
        try {
            const response = await fetch(`${apiUrl}/createLeague`, {
                method: "POST",
                credentials: "include"
            });
            const data = await response.json();
            if (data.leagueId) {
                setLeagueId(data.leagueId);
                setShowCreateLeague(true);
            }
        } catch (error) {
            console.error("Erreur lors de la création de la ligue:", error);
        }
    };

    const handleJoinLeague = async () => {
        const leagueIdNum = Number(inputLeagueId);

        if (isNaN(leagueIdNum)) {
            console.error("Le leagueId doit être un nombre");
            setJoinLeagueExist(false);
            return;
        }

        try {
            console.log("league:",inputLeagueId);
            const response = await fetch(`${apiUrl}/joinLeague/${inputLeagueId}`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                navigate(`/create-team/${inputLeagueId}`);
            } else {
                setJoinLeagueExist(false);
            }
        } catch (error) {
            setJoinLeagueExist(false);
            console.error("Erreur lors de la jointure à la ligue:", error);
        }
    };

    const copyToClipboard = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
            }).catch(err => {
                console.error("Erreur lors de la copie :", err);
            });
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand("copy");
                console.log("Texte copié avec succès !");
            } catch (err) {
                console.error("Erreur lors de la copie pour les navigateurs plus anciens :", err);
            }
            document.body.removeChild(textarea);
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
                        <Link className="choose-league-no-link" to="/create-team/0"><h2>Ligue générale</h2></Link>
                        <Link className="choose-league-no-link" to="/create-team/1"><h2>Néo Ligue</h2></Link>
                    </div>
                    <div className="choose-league-choice">
                        <h2 onClick={handleCreateLeague}>Créer ma ligue</h2>
                        <h2 onClick={() => setShowJoinLeague(true)}>Rejoindre une ligue</h2>
                    </div>
                </div>
            )}

            {showCreateLeague && (
                <div className="league-info">
                    <div className="league-info-league-number">
                        <p>Votre numéro de ligue : {leagueId}</p>
                        <button onClick={() => copyToClipboard(leagueId)}>Copier</button>
                    </div>
                    <Link className="choose-league-create-no-link" to={`/create-team/${leagueId}`}><p>Créer mon équipe</p></Link>
                </div>
            )}

            {showJoinLeague && (
                <div className="league-join">
                    <div className="league-join-input">
                        <input
                            type="text"
                            value={inputLeagueId}
                            onChange={(e) => setInputLeagueId(e.target.value)}
                            placeholder="Numéro de la ligue"
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