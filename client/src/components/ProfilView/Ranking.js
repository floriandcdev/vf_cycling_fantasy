import React from "react";
import { useAuth } from "../../AuthContext";

import "../styles/Ranking.css";

const Ranking = ({ rankings }) => {   
    const { user } = useAuth();

    return (
        <main>
            <h1>Classement</h1>
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Nom</th>
                        <th>Points Totals</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.map((ranking, index) => (
                            <tr key={index} className={ranking.userId === user.id ? "highlighted" : ""}>
                                <td>{ranking.position}</td>
                                <td>{ranking.name}</td>
                                <td>{ranking.total_points}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default Ranking;