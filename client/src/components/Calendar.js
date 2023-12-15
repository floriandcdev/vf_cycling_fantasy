import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Calendar = () => {
    const [races, setRaces] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

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
        <main>
            <h1>Calendrier des Courses</h1>
            {races.map((race, index) => (
                <div key={index}>
                    <h2><Link to={`/show-race-detail/${race.raceId}`}>{race.name}</Link></h2>
                    <p>Date: {formatDate(race.date_start)} - {formatDate(race.date_end)} </p>
                </div>
            ))}
        </main>
    );
};

export default Calendar;