import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./styles/ShowRaceDetail.css";

const ShowRaceDetail = () => {
    const [raceDetail, setRaceDetail] = useState(null);
    const [raceRanking, setRaceRanking] = useState(null);
    const { idRace } = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;

    //const specificDate = new Date(2024, 11, 22);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchRaceDetail = async () => {
            try {
                const response = await fetch(`${apiUrl}/get-race-detail/${idRace}`);
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des détails de la course");
                }
                const data = await response.json();
                setRaceDetail(data);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchRaceDetail();
    }, [apiUrl, idRace]);

    useEffect(() => {
        if (raceDetail && new Date(raceDetail.date_end) < new Date()) {
            fetch(`${apiUrl}/race-ranking/${idRace}`)
                .then(response => response.json())
                .then(data => setRaceRanking(data))
                .catch(error => console.error("Erreur:", error));
        }
    }, [apiUrl, idRace, raceDetail]);

    return (
        <main className="show-race-detail">
            <h1>Détails de la Course</h1>
            {raceDetail ? (
                <div className="show-race-detail-course">
                    <p>Nom: {raceDetail.name}</p>
                    <p>Étape: {raceDetail.step}</p>
                    <p>Date de début: {formatDate(raceDetail.date_start)}</p>
                    <p>Date de fin: {formatDate(raceDetail.date_end)}</p>
                    <p>Catégorie: {raceDetail.category}</p>
                    <h2>Classement de la Course</h2>
                    {raceRanking && Array.isArray(raceRanking) ? (
                        <div className="show-race-detail-table">
                            <div className="show-race-detail-table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Nom du Coureur</th>
                                            <th>Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {raceRanking.map((ranking, index) => (
                                            <tr key={index}>
                                                <td>{ranking.position}</td>
                                                <td>{ranking.rider_name}</td>
                                                <td>{ranking.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="show-race-detail-empty">La course n'a pas encore eu lieu</p>
                    )}
                </div>
            ) : (
                <p className="show-race-detail-empty">Chargement des détails de la course...</p>
            )}
        </main>
    );
};

export default ShowRaceDetail;