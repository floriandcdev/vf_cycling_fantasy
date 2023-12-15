import React, { useState, useEffect } from "react";

const Quoting = () => {
    const [cyclists, setCyclists] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchCyclists = async () => {
            try {
                const response = await fetch(`${apiUrl}/cyclists-list`);
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
    }, [apiUrl]);

    return (
        <main>
            <h1 style={{ padding: '50px 0' }}>Quoting des Cyclistes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Équipe</th>
                        <th>Division</th>
                        <th>Nationalité</th>
                        <th>Valeur Finale</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default Quoting;