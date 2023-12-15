import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const ConfirmChoices = ({ selectedCyclists, cyclistsBonus, races, selectedRaces, bonusRaces, leagueId, nextStep, prevStep }) => {
    const obligatoryRaces = races.filter(race => race.competition_number === 0);
    const { user } = useAuth();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleConfirm = () => {
        if (!user) {
            navigate("/logIn");
            return;
        }

        const playerTeamData = {
            selectedCyclists,
            cyclistsBonus,
            selectedRaces: [...obligatoryRaces, ...selectedRaces],
            bonusRaces, 
            leagueId
        };

        fetch(`${apiUrl}/savePlayerTeam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(playerTeamData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            console.log("Success:", data);
            nextStep();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };
    
    return (
        <div>
            <h2>Confirmez vos choix</h2>

            <h3>Coureurs sélectionnés:</h3>
            <ul>
                {selectedCyclists.map(cyclist => (
                    <li key={cyclist.cyclistId}>{cyclist.name} - {cyclist.value}M</li>
                ))}
            </ul>

            <h3>Coureurs changeables:</h3>
            <ul>
                {cyclistsBonus.map(cyclist => (
                    <li key={cyclist.cyclistId}>{cyclist.name} - {cyclist.value}M</li>
                ))}
            </ul>

            <h3>Courses sélectionnées (Obligatoire):</h3>
            <ul>
                {obligatoryRaces.map(race => (
                    <li key={race.raceId}>{race.name}</li>
                ))}
            </ul>

            <h3>Courses sélectionnées (Non obligatoire):</h3>
            <ul>
                {selectedRaces.map(race => (
                    <li key={race.raceId}>{race.name}</li>
                ))}
            </ul>

            <h3>Courses bonus:</h3>
            <ul>
                {bonusRaces.map(race => (
                    <li key={race.raceId}>{race.name}</li>
                ))}
            </ul>

            <button onClick={prevStep}>Précédent</button>
            <button onClick={handleConfirm}>Confirmer</button>
        </div>
    );
}

export default ConfirmChoices;