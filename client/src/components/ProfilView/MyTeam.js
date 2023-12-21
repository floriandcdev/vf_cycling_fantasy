import React from "react";

import "../styles/MyTeam.css";

const MyTeam = ({ cyclists, teamLabel }) => {

    return (
        <section className="my-team">
            <h1>MON ÉQUIPE : {teamLabel}</h1>
            {cyclists.length > 0 ? (
                <div className="my-team-table">
                    <div className="my-team-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>COUREUR</th>
                                    <th>ÉQUIPE</th>
                                    <th>VALEUR</th>
                                    <th>POINTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cyclists.map((cyclist) => (
                                    <tr key={cyclist.cyclistId} >
                                        <td>
                                            <div className="my-team-name-info">
                                                <img 
                                                    className="my-team-flag-icon"
                                                    src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                                    alt={`Drapeau de ${cyclist.nationality}`} 
                                                    width="20" 
                                                    height="15"
                                                />
                                                <span>{cyclist.name}</span>
                                            </div>
                                        </td>
                                        <td>{cyclist.team}</td>
                                        <td>{cyclist.finalValue}</td>
                                        <td>{cyclist.cyclistPoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>Aucun cycliste trouvé pour cette team dans cette ligue.</p>
            )}
        </section>
    );
};

export default MyTeam;