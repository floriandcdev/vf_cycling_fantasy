import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/MyRaces.css";

const MyRaces = ({ races}) => {
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

    return (
        <section className="my-races">
            <h1>CALENDRIER DES COURSES</h1>
            <div className="my-races-table">
                    <div className="my-races-table-container">
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
                                            <div className="my-races-name-container">
                                                <img 
                                                    className="my-races-flag-icon"
                                                    src={`${process.env.PUBLIC_URL}/flags/${race.country.replace(/ /g, '_').toLowerCase()}.png`} 
                                                    alt={`Drapeau de ${race.country}`} 
                                                    width="20" 
                                                    height="20"
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
        </section>
    );
};

export default MyRaces;

/*<Link to={`/show-race-detail/${race.raceId}`}></Link>*/