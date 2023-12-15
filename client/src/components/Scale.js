import React, { useState, useEffect } from "react";

import "./styles/Scale.css";

const Scale = () => {
    const [scales, setScales] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchScales = async () => {
            try {
                const response = await fetch(`${apiUrl}/scale`);
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des données de classement");
                }
                const data = await response.json();
                setScales(data);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchScales();
    }, [apiUrl]);

    return (
        <main>
            <h1 style={{ padding: '50px 0' }}>Classement des Courses</h1>
            {Object.keys(scales).map((scaleName, index) => (
                <div key={index}>
                    <h2>{scaleName}</h2>
                    <table className="table-scale">
                        <thead>
                            <tr>
                                <th>Position</th>
                                {[...Array(22).keys()].map(position => {
                                    let headerLabel;
                                    if (position < 19) {
                                        headerLabel = position + 1;
                                    } else if (position === 19) {
                                        headerLabel = '20-29';
                                    } else if (position === 20) {
                                        headerLabel = '30-39';
                                    } else {
                                        headerLabel = '40-49';
                                    }

                                    return <th key={position}>{headerLabel}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Points</td>
                                {[...Array(22).keys()].map(position => (
                                    <td key={position + 1}>{scales[scaleName][`position${position + 1}`] || '-'}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </main>
    );
};

export default Scale;