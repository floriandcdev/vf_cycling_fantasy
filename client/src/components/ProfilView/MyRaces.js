import React from "react";
import { Link } from "react-router-dom";

const MyRaces = ({ races}) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };

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

export default MyRaces;