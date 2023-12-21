import React, { useState, useEffect } from "react";

import "./styles/Quoting.css";

const Quoting = () => {
    const [cyclists, setCyclists] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [selectedCyclistList, setSelectedCyclistList] = useState(1);

    const handleButtonClick = (buttonName) => {
        setSelectedCyclistList(buttonName);
    };

    useEffect(() => {
        const fetchCyclists = async () => {
            try {
                const response = await fetch(`${apiUrl}/cyclists-list/0`);
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
        <main className="quoting">
            <h1>COTATION DES CYCLISTES</h1>
            <div className="quoting-choice">
                <button
                    onClick={() => handleButtonClick(1)}
                    style={{ backgroundColor: selectedCyclistList === 1 ? "#FFF511" : "#FDDD07" }}
                >
                    WORLD TOUR
                </button>
                <button
                    onClick={() => handleButtonClick(2)}
                    style={{ backgroundColor: selectedCyclistList === 2 ? "#FFF511" : "#FDDD07" }}
                >
                    NÉO PRO
                </button>
            </div>
            <div className="quoting-table">
                <div className="quoting-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>COUREUR</th>
                                <th>ÉQUIPE</th>
                                <th>VALEUR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cyclists.filter(cyclist => cyclist.cyclistGroupId === selectedCyclistList).map((cyclist, index) => (
                                <tr key={index}>
                                    <td>{cyclist.name}</td>
                                    <td>{cyclist.team}</td>
                                    <td>{cyclist.finalValue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Quoting;