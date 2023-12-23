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
    const [sectionActive, setSessionActive] = useState("Tableau de bord");
    const [selectedLeague, setSelectedLeague] = useState();
    const [selectedTeam, setSelectedTeam] = useState();
    const [leagues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSelectChangeLeague = (event) => {
        const selectValue = parseInt(event.target.value, 10);
        setSelectedLeague(selectValue);

        const availableTeamsInLeague = teams.filter(team => team.leagueId === selectValue);
        if (!availableTeamsInLeague.some(team => team.teamId === selectedTeam)) {
            setSelectedTeam(availableTeamsInLeague[0].teamId);
        }
    };

    const handleSelectChangeTeam = (event) => {
        const selectValue = parseInt(event.target.value, 10);
        setSelectedTeam(selectValue);
    };

    const showSession = (sectionName) => {
        setSessionActive(sectionName);
    };

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
                const params = new URLSearchParams({
                    selectedLeague: selectedLeague,
                    selectedTeam: selectedTeam
                });

                const response = await fetch(`${apiUrl}/cyclists-list-user/?${params.toString()}`, {
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
        if (selectedLeague) {
            fetchCyclists();
        }
    }, [apiUrl, user, navigate, selectedLeague, selectedTeam]);

    useEffect(() => {
        const fetchRankings = async () => {
            if (!user) {
                navigate("/logIn");
                return;
            }
            
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

        if (selectedLeague) {
            fetchRankings();
        }
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
    
        if (selectedLeague) {
            fetchPersonalRaces();
        }
    }, [apiUrl, user, navigate, selectedLeague]);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await fetch(`${apiUrl}/leagueTeamListUser`, {
                    credentials: "include"
                });
    
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des ligues");
                }
        
                const data = await response.json();

                if (data.length > 0) {
                    const uniqueLeagueIds = new Set();
                    const leaguesData = data.filter(item => {
                        const id = parseInt(item.leagueId, 10);
                        if (!uniqueLeagueIds.has(id)) {
                            uniqueLeagueIds.add(id);
                            return true;
                        }
                        return false;
                    })
                    .map(item => ({
                        leagueId: parseInt(item.leagueId, 10),
                        leagueLabel: item.leagueLabel
                    }));        
                    setLeagues(leaguesData);

                    const teamsData = data.map(item => ({
                        teamId: parseInt(item.teamId, 10),
                        leagueId: parseInt(item.leagueId, 10)
                    }));
                    setTeams(teamsData);

                    setSelectedLeague(data[0].leagueId);
                    setSelectedTeam(data[0].teamId);
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
                <div className="profil-menu-logo">
                    <img src={epopeeLogo} alt="Logo de l'épopée" width="358" height="139" />
                    <p>Votre nouveau jeu de cyclisme fantasy</p>
                </div>
                <h4 onClick={() => showSession("Tableau de bord")} style={{ borderBottomColor: sectionActive === "Tableau de bord" ? "#FFE220" : "black" }}>Tableau de bord</h4>
                <h4 onClick={() => showSession("MyTeam")} style={{ borderBottomColor: sectionActive === "MyTeam" ? "#FFE220" : "black" }}>Mon équipe</h4>
                <h4 onClick={() => showSession("Ranking")} style={{ borderBottomColor: sectionActive === "Ranking" ? "#FFE220" : "black" }}>Classements</h4>
                <h4 onClick={() => showSession("MyRaces")} style={{ borderBottomColor: sectionActive === "MyRaces" ? "#FFE220" : "black" }}>Mes prochaines courses</h4>
            </div>
            {sectionActive === "MyTeam" && <MyTeam cyclists={cyclists} teamLabel={selectedTeam === 1 ? "WORLD TOUR" : "NÉO PRO"}/>}
            {sectionActive === "Ranking" && <Ranking rankings={rankings}/>}
            {sectionActive === "MyRaces" && <MyRaces races={races}/>}
            {sectionActive === "Tableau de bord" &&
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
                    <Link className="profil-no-link" to="/choose-league"><p className="profil-empty-cyclist-message">Gérer mes ligues et mes équipes <span>(16 janvier à 23h59 au plus tard)</span></p></Link>                                
                </div>
                <div className="profil-grid">
                    {/* Zone en haut à gauche */}
                    <div className="profil-section section-top-left">
                        <div className="profil-section-header">
                            <div className="profil-section-header-team">
                                <h2>Mon équipe</h2>
                                <select onChange={handleSelectChangeTeam} value={selectedTeam}>
                                    {teams.filter(team => team.leagueId === selectedLeague).map((team) => (
                                        <option key={team.teamId} value={team.teamId}>
                                            {team.teamId === 1 ? "World Tour" : "Néo Pro"}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                                    <p>Valeur : <span>{cyclist.finalValue}</span></p>  
                                                </div>
                                                <div style={{ width: "100%", height: "10px", backgroundColor: cyclist.teamColor, marginLeft: "auto", marginRight: "auto",  }}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="profil-interchangeable-cyclists-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Les moins rentables (points)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cyclists.slice().sort((a, b) => a.cyclistPoints - b.cyclistPoints).slice(0, 5).map((cyclist, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="profil-cyclists-name-info-low-cyclist">
                                                                <div className="profil-cyclists-name-info-low-cyclist-name">
                                                                    <img 
                                                                        className="profil-cyclists-flag-icon"
                                                                        src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                                                        alt={`Drapeau de ${cyclist.nationality}`} 
                                                                        width="20" 
                                                                        height="15"
                                                                    />
                                                                    <p>{cyclist.name}</p>
                                                                </div>
                                                                <span>{cyclist.cyclistPoints}</span>
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
                                    <Link className="profil-no-link" to="/choose-league"><p className="profil-empty-cyclist-message">Créer une équipe ou rejoindre une ligue <span>(16 janvier à 23h59 au plus tard)</span></p></Link>
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
                                    {rankings.filter(ranking => ranking.teamId === 1).slice(0, 7).map((ranking, index) => (
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
                                    <div className="profil-empty-races-container">
                                        <Link className="profil-no-link" to="/choose-league"><p className="profil-empty-races-message">Créer une équipe</p></Link>
                                    </div>
                                    <p className="profil-empty-races-message"><span>(16 janvier à 23h59 au plus tard)</span></p>
                            </div>
                        )}
                    </div>

                    {/* Zone en bas à droite */}
                    <div className="profil-section section-bottom-right">
                        <div className="profil-section-header">
                            <span>Classement NéoPro</span>
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
                                    {rankings.filter(ranking => ranking.teamId === 2).slice(0, 7).map((ranking, index) => (
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
        </main>
        
    );
}

export default Profil;