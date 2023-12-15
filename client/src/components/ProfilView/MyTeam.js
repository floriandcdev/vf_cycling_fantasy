import React from "react";

const MyTeam = ({ cyclists, onBack }) => {

    return (
        <main>
            <h1>Mon Équipe</h1>
            <button onClick={onBack}>Retour</button>
            {cyclists.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Équipe</th>
                            <th>Division</th>
                            <th>Nationalité</th>
                            <th>Valeur Finale</th>
                            <th>Points Actuels</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cyclists.map((cyclist, index) => (
                            <tr key={index}>
                                <td>{cyclist.name}</td>
                                <td>{cyclist.team}</td>
                                <td>{cyclist.division}</td>
                                <td>{cyclist.nationality}</td>
                                <td>{cyclist.final_value}</td>
                                <td>{cyclist.current_points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun cycliste trouvé pour cet ID de joueur.</p>
            )}
        </main>
    );
};

export default MyTeam;