import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/Calendar.css";

const Calendar = () => {
    const [races, setRaces] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const handleRowClick = (raceId) => {
        navigate(`/show-race-detail/${raceId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {    
        const fetchGeneralRaces = async () => {
            try {
                const response = await fetch(`${apiUrl}/races-list`, {
                    method: "GET",
                });
    
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des courses générales");
                }
    
                const data = await response.json();
                setRaces(data);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };
    
        fetchGeneralRaces();
    }, [apiUrl]);

    return (
        <main className="calendar">
            <h1>CALENDRIER DES COURSES</h1>
            <div className="calendar-table">
                    <div className="calendar-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>COURSES</th>
                                    <th>CATÉGORIE</th>
                                    <th>DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {races.map((race) => (
                                    <tr key={race.raceId} onClick={() => handleRowClick(race.raceId)}>
                                        <td>
                                            <div className="calendar-name-container">
                                                <img 
                                                    className="calendar-flag-icon"
                                                    src={`${process.env.PUBLIC_URL}/flags/${race.country.replace(/ /g, '_').toLowerCase()}.png`} 
                                                    alt={`Drapeau de ${race.country}`} 
                                                    width="20" 
                                                    height="15"
                                                />
                                                <span>{race.name}</span>
                                            </div>
                                        </td>
                                        <td>{race.category}</td>
                                        <td>{formatDate(race.date_start)}</td>
                                    </tr>                                    
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </main>
    );
};

export default Calendar;