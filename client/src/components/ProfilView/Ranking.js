import React, { useState } from "react";
import { useAuth } from "../../AuthContext";

import "../styles/Ranking.css";

const Ranking = ({ rankings }) => {   
    const { user } = useAuth();
    const [selectedTeam, setSelectedTeam] = useState(1);

    const handleButtonClick = (buttonName) => {
        setSelectedTeam(buttonName);
    };

    return (
        <section className="my-ranking">
            <div className="my-ranking-choice">
                <button
                    onClick={() => handleButtonClick(1)}
                    style={{ backgroundColor: selectedTeam === 1 ? "#FFF511" : "#FDDD07" }}
                >
                    WORLD TOUR
                </button>
                <button
                    onClick={() => handleButtonClick(2)}
                    style={{ backgroundColor: selectedTeam === 2 ? "#FFF511" : "#FDDD07" }}
                >
                    NÉO PRO
                </button>
            </div>
            <div className="my-ranking-table">
                <div className="my-ranking-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>POSITION</th>
                                <th>NOM DU JOUEUR</th>
                                <th>POINTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.filter(ranking => ranking.teamId === selectedTeam).map((ranking, index) => (
                                <tr key={index} className={ranking.userId === user.id ? "highlighted" : ""}>
                                    <td>{ranking.position}</td>
                                    <td>{ranking.name}</td>
                                    <td>{ranking.total_points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Ranking;