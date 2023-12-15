import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

import MyTeam from "./ProfilView/MyTeam";
import Ranking from "./ProfilView/Ranking";
import MyRaces from "./ProfilView/MyRaces";

import "./styles/Profil.css";

import epopeeLogo from "../medias/png/logo/epopee_logo.png";

const Profil = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cyclists, setCyclists] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [races, setRaces] = useState([]);
    const [sectionActive, setSessionActive] = useState("");
    const [selectedLeague, setSelectedLeague] = useState();
    const [leagues, setLeagues] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSelectChangeLeague = (event) => {
        const selectValue = parseInt(event.target.value, 10);
        setSelectedLeague(selectValue);
    };

    const showSession = (sectionName) => {
        setSessionActive(sectionName);
    };

    const resetSession = () => {
        setSessionActive("");
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchCyclists = async () => {
            if (!user) {
                navigate("/logIn");
                return;
            }
            
            try {
                const response = await fetch(`${apiUrl}/cyclists-list-user/${selectedLeague}`, {
                    credentials: "include"
                });
                
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des cyclistes");
                }

                const data = await response.json();
                setCyclists(data);
                
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchCyclists();
    }, [apiUrl, user, navigate, selectedLeague]);

    useEffect(() => {
        const fetchRankings = async () => {
            if (!user) {
                navigate("/logIn");
                return;
            }
            console.log("Profil user:",user);
            
            try {
                const response = await fetch(`${apiUrl}/ranking/${selectedLeague}`, {
                    credentials: "include"
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération du classement");
                }

                const data = await response.json();
                setRankings(data);

            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchRankings();
    }, [apiUrl, user, navigate, selectedLeague]);

    useEffect(() => {   
        if (!user) {
            navigate("/logIn");
            return;
        }

        const fetchPersonalRaces = async () => {
            try {
                const response = await fetch(`${apiUrl}/races-list-user/${selectedLeague}`, {
                    credentials: "include"
                });
    
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des courses personnelles");
                }
    
                const data = await response.json();
                setRaces(data);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };
    
        fetchPersonalRaces();
    }, [apiUrl, user, navigate, selectedLeague]);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await fetch(`${apiUrl}/leagueListUser`, {
                    credentials: "include"
                });
    
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des ligues");
                }
    
                const data = await response.json();
                setLeagues(data);
                if (data.length > 0) {
                    setSelectedLeague(data[0].leagueId);
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        };
    
        fetchLeagues();
    }, [apiUrl]);

    return (
        <main className="profil">
                <div className="profil-menu">
                    <img src={epopeeLogo} alt="Logo de l'épopée" width="358" height="139" />
                    <h4 onClick={() => showSession("MyTeam")}>Mon équipe</h4>
                    <h4 onClick={() => showSession("Ranking")}>Classements</h4>
                    <h4 onClick={() => showSession("MyRaces")}>Mes prochaines courses</h4>
                </div>
                {sectionActive === "MyTeam" && <MyTeam cyclists={cyclists} onBack={resetSession}/>}
                {sectionActive === "Ranking" && <Ranking rankings={rankings} onBack={resetSession}/>}
                {sectionActive === "MyRaces" && <MyRaces races={races} onBack={resetSession}/>}
                {sectionActive === "" &&
                <div>
                <div className="profil-header">                    
                    <h1>Mon tableau de bord</h1>
                    <div className="profil-header-league-choice">
                        <label>Ma ligue : </label>
                        <select onChange={handleSelectChangeLeague} value={selectedLeague}>
                            {leagues.map((league) => (
                                <option key={league.leagueId} value={league.leagueId}>
                                    {league.leagueLabel}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Link className="profil-no-link" to="/choose-league"><p className="profil-empty-cyclist-message">Gérer mes ligues et équipes <span>(16 janvier à 23h59 au plus tard)</span></p></Link>                                
                </div>
                <div className="profil-grid">
                    {/* Zone en haut à gauche */}
                    <div className="profil-section section-top-left">
                        <div className="profil-section-header">
                            <h2>Mon équipe</h2>
                            <button onClick={() => showSession("MyTeam")}>Tout voir</button>
                        </div>
                        <div className="profil-section-title">
                            <h3>Mes joueurs</h3>
                            <p>Classé par valeur</p>
                        </div>
                        <div className="profil-section-top-left-content">
                            {cyclists && cyclists.length > 0 ? (
                                <div className="profil-cyclists-container">
                                    <div className="profil-cyclists-grid">
                                        {cyclists.slice(0, 8).map((cyclist, index) => (
                                            <div className="profil-cyclist-cell" key={index}>
                                                <div className="profil-cyclist-info">
                                                    <div className="profil-cyclists-name-info">
                                                        <img 
                                                            className="profil-cyclists-flag-icon"
                                                            src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                                            alt={`Drapeau de ${cyclist.nationality}`} 
                                                            width="20" 
                                                            height="15"
                                                        />
                                                        <h4>{cyclist.name}</h4>
                                                    </div>                                                
                                                    <p>{cyclist.team}</p>
                                                    <p>Valeur : <span>{cyclist.final_value}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="profil-interchangeable-cyclists-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Mes joueurs interchangeables</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cyclists.slice(0, 5).map((cyclist, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="profil-cyclists-name-info">
                                                                <img 
                                                                    className="profil-cyclists-flag-icon"
                                                                    src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                                                    alt={`Drapeau de ${cyclist.nationality}`} 
                                                                    width="20" 
                                                                    height="15"
                                                                />
                                                                <span>{cyclist.name}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) :(
                                <div className="profil-empty-cyclist-container">
                                    <Link className="profil-no-link" to="/choose-league"><p className="profil-empty-cyclist-message">Créer ou rejoindre une ligue <span>(16 janvier à 23h59 au plus tard)</span></p></Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Zone en haut à droite */}
                    <div className="profil-section section-top-right">
                        <div className="profil-section-header">
                            <span>Classement Général</span>
                            <button onClick={() => showSession("Ranking")}>Tout voir</button>
                        </div>
                        <div className="profil-section-top-right-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Nom du Joueur</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankings.slice(0, 7).map((ranking, index) => (
                                        <tr key={index}>
                                            <td>{ranking.position}</td>
                                            <td>{ranking.name}</td>
                                            <td>{ranking.total_points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Zone en bas à gauche */}
                    <div className="profil-section section-bottom-left">
                        <div className="profil-section-header">
                            <span>Mes dernières courses</span>
                            <button onClick={() => showSession("MyRaces")}>Tout voir</button>
                        </div>
                        <div className="profil-section-bottom-left-content">
                            <div className="profil-last-races-grid">
                                {races.slice(0, 2).map((race, index) => (
                                    <React.Fragment key={index}>
                                        <div className="profil-last-race-cell">Course<br />{race.name}</div>
                                        <div className="profil-last-race-cell"><strong>Points<br />{race.competition_number}</strong></div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Zone en bas au centre */}
                    <div className="profil-section section-bottom-center">
                        <div className="profil-section-header">
                            <span>Prochaines courses</span>
                            <button onClick={() => showSession("MyRaces")}>Tout voir</button>
                        </div>
                        { races && races.length > 0 ? (
                            <div className="profil-section-bottom-center-content">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Départ</th>
                                            <th>Nom de la course</th>
                                            <th>Arrivée</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {races.slice(0, 7).map((race, index) => (
                                            <tr key={index}>
                                                <td>{formatDate(race.date_start)}</td>
                                                <td>{race.name}</td>
                                                <td>{formatDate(race.date_end)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="profil-empty-races-container">
                                    <p className="profil-empty-races-message">Choisir mes courses</p>
                                    <p className="profil-empty-races-message"><span>(16 janvier à 23h59 au plus tard)</span></p>
                            </div>
                        )}
                    </div>

                    {/* Zone en bas à droite */}
                    <div className="profil-section section-bottom-right">
                        <div className="profil-section-header">
                            <span>Classement Néoligue</span>
                            <button onClick={() => showSession("Ranking")}>Tout voir</button>
                        </div>
                        <div className="profil-section-bottom-right-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Nom du Joueur</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankings.slice(0, 7).map((ranking, index) => (
                                        <tr key={index}>
                                            <td>{ranking.position}</td>
                                            <td>{ranking.name}</td>
                                            <td>{ranking.total_points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            }


            {/*
        <main className="profil">
            <div>
                <Link to="/create-team">Créer une équipe (avant le 15 janvier)</Link>
            </div>

            <div>
                <Link to="/last-races">Dernière course</Link>
            </div>

            <div>
                <Link to="/next-races">Prochaine course</Link>
            </div>

            <div>
                <Link to="/calendar/my-calendar">Mon Planning</Link>
            </div>      
    </main>*/}
        </main>
        
    );
}

export default Profil;