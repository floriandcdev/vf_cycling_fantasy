import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/SelectBonusRaces.css";

const SelectBonusRace = ({ selectedRaces, setBonusRaces, bonusRaces, races, prevStep, saveData }) => {
    const bonusEligibleRaces = races.filter(race => race.groupCompetitionId === 0);
    const combinedRaces = [...selectedRaces, ...bonusEligibleRaces];
    const [confirmValidDataPopup, setConfirmValidDataPopup] = useState(false);
    const navigate = useNavigate();

    const handleSelectBonusRace = race => {
        const isRaceInBonusRaces = raceId => bonusRaces.some(br => br.raceId === raceId);

        if (isRaceInBonusRaces(race.raceId)) {
          setBonusRaces(bonusRaces.filter(br => br.raceId !== race.raceId));
        } else {
          setBonusRaces([...bonusRaces, race]);
        }
    };
    
    const isBonusRaceSelected = raceId => {
        return bonusRaces.some(br => br.raceId === raceId);
    };

    const validData = () => {
        saveData()
            .then(() => {
                setConfirmValidDataPopup(true);
            })
            .catch((error) => {
                console.error("Erreur lors de l'enregistrement :", error);
            });
    };

    const handleClosePopup = () => {
        navigate("/profil");
    };


    return (
        <main className="select-races-bonus">
            {
                confirmValidDataPopup && (
                    <div className="select-races-bonus-popup">
                        <div className="select-races-bonus-popup-content">
                            <p>Félicitation !<br />Vos choix d'équipe ont bien été pris en compte.</p>
                            <button onClick={handleClosePopup}>Valider</button>
                        </div>
                    </div>
                )
            }
            <div className="select-races-bonus-shadow-container">
                <div className="select-races-bonus-title">
                    <h1>CRÉER SON ÉQUIPE - CHOIX DES OBJECTIFS DE SAISON</h1>
                    <div className="select-races-bonus-shadow-mask-right"></div>
                    <div className="select-races-bonus-shadow-mask-bottom"></div>
                </div>
            </div>
            <div className="select-races-bonus-header">
                <div className="select-races-bonus-rules">
                    <p >Sélectionnez vos courses bonus : leurs points points compteront double.</p>
                </div>
                <div className="select-races-bonus-change-step">
                    <button onClick={prevStep}>PRÉCÉDENT</button>
                    <button onClick={validData} disabled={bonusRaces.length !== 3}>VALIDER</button>
                </div>  
            </div>
            <div className="select-races-bonus-pannel-view">
                <div className="select-races-bonus-choice">
                    <div className="select-races-bonus-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>NOM DE LA COURSE</th>
                                    <th>CATÉGORIE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combinedRaces.map((race) => (
                                    <tr key={race.raceId} onClick={() => handleSelectBonusRace(race)} className={isBonusRaceSelected(race.raceId) ? "select-races-bonus-table-selected-row" : ""}>
                                        <td>
                                            <div className="select-races-bonus-table-name-container">
                                                <img 
                                                    className="select-races-bonus-table-flag-icon"
                                                    src={`${process.env.PUBLIC_URL}/flags/${race.country.replace(/ /g, '_').toLowerCase()}.png`} 
                                                    alt={`Drapeau de ${race.country}`} 
                                                    width="20" 
                                                    height="20"
                                                />
                                                <span>{race.name}</span>
                                            </div>
                                        </td>
                                        <td>{race.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="select-races-bonus-choice-view">
                    <p className="select-races-bonus-selected-number">
                        Courses sélectionnées : 
                        <span className={bonusRaces.length === 3 ? "select-races-bonus-selected-races-green" : "select-races-bonus-selected-races-red"}>
                            {bonusRaces.length}
                        </span>/3
                    </p>
                    <div className="select-races-bonus-line-container">
                        {bonusRaces.map(race => (
                            <div className="select-races-bonus-selected-cell" key={race.raceId}>            
                                <div className="select-races-bonus-selected-info">
                                    <img src={`${process.env.PUBLIC_URL}/icons/cancel.png`} alt="Icone de suppression" width="17" height="17" onClick={() => handleSelectBonusRace(race)} />
                                    <div className="select-races-bonus-selected-name-container">
                                        <img 
                                            className="select-races-bonus-selected-flag-icon"
                                            src={`${process.env.PUBLIC_URL}/flags/${race.country.replace(/ /g, '_').toLowerCase()}.png`} 
                                            alt={`Drapeau de ${race.country}`} 
                                            width="20" 
                                            height="20"
                                        />
                                        <h4>{race.name}</h4>
                                    </div>
                                    <p>{race.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>     
        </main>
    );
}

export default SelectBonusRace;