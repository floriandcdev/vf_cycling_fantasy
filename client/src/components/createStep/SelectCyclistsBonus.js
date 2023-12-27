import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/SelectCyclistsBonus.css";

const SelectCyclistsBonus = ({ selectedCyclists, setCyclistsBonus, cyclistsBonus, nextStep, prevStep, teamId, saveData }) => {
    const [confirmValidDataPopup, setConfirmValidDataPopup] = useState(false);
    const navigate = useNavigate();
    console.log("teamId:",teamId);
    
    const handleCyclistsBonus = cyclist => {
        if (cyclistsBonus.some(changeable => changeable.cyclistId === cyclist.cyclistId)) {
            
            setCyclistsBonus(cyclistsBonus.filter(changeable => changeable.cyclistId !== cyclist.cyclistId));
        } else {
            
            setCyclistsBonus([...cyclistsBonus, cyclist]);
        }
    };

    const isCyclistsBonusSelected = (cyclistId) => {
        return cyclistsBonus.some(changeable => changeable.cyclistId === cyclistId);
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
        <main className="select-cyclists-bonus">
            {
                confirmValidDataPopup && (
                    <div className="select-cyclists-bonus-popup">
                        <div className="select-cyclists-bonus-popup-content">
                            <p>Félicitation !<br />Vos choix d'équipe ont bien été pris en compte.</p>
                            <button onClick={handleClosePopup}>Valider</button>
                        </div>
                    </div>
                )
            }
            <div className="select-cyclists-bonus-shadow-container">
                <div className="select-cyclists-bonus-title">
                    <h1>CRÉER SON ÉQUIPE - CHOIX DU COUREUR BONUS</h1>
                    <div className="select-cyclists-bonus-shadow-mask-right"></div>
                    <div className="select-cyclists-bonus-shadow-mask-bottom"></div>
                </div>
            </div>
            <div className="select-cyclists-bonus-header">
                <div className="select-cyclists-bonus-rules">
                    <p >Sélectionnez votre cycliste bonus, ses points seront doublés.</p>
                </div>

                <div className="select-cyclists-bonus-change-step">
                    <button onClick={prevStep}>PRÉCÉDENT</button>
                    <button onClick={teamId === 1 ? nextStep : validData} disabled={cyclistsBonus.length !== 1}>SUIVANT</button>
                </div> 
            </div>

            <div className="select-cyclists-bonus-pannel-view">
                <div className="select-cyclists-bonus-choice">
                    <div className="select-cyclists-bonus-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>COUREUR</th>
                                    <th>ÉQUIPE</th>
                                    <th>NATION</th>
                                    <th>VALEUR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCyclists.filter(cyclist => cyclist.finalValue < 5).map((cyclist) => (
                                    <tr key={cyclist.cyclistId} onClick={() => handleCyclistsBonus(cyclist)} className={isCyclistsBonusSelected(cyclist.cyclistId) ? "select-cyclists-bonus-table-selected-row" : ""}>
                                        <td>
                                            <div className="select-cyclists-bonus-name-info">
                                                <img 
                                                    className="select-cyclists-bonus-flag-icon"
                                                    src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                                    alt={`Drapeau de ${cyclist.nationality}`} 
                                                    width="20" 
                                                    height="20"
                                                />
                                                <span>{cyclist.name}</span>
                                            </div>
                                        </td>
                                        <td>{cyclist.team}</td>
                                        <td>{cyclist.nationality}</td>
                                        <td>{cyclist.finalValue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="select-cyclists-bonus-line-container">
                    {cyclistsBonus.map(cyclist => (
                        <div className="select-cyclists-bonus-selected-cell" key={cyclist.cyclistId}>            
                            <div className="select-cyclists-bonus-selected-info">
                                <img src={`${process.env.PUBLIC_URL}/icons/cancel.png`} className="select-cyclists-bonus-cancel-icon" alt="Icone de suppression" width="17" height="17" onClick={() => handleCyclistsBonus(cyclist)} />
                                <h4>
                                    <img 
                                        className="select-cyclists-bonus-flag-icon"
                                        src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                        alt={`Drapeau de ${cyclist.nationality}`} 
                                        width="20" 
                                        height="20"
                                    />
                                    {cyclist.name}
                                </h4>
                                <p>{cyclist.team}</p>
                                <p>Valeur : <strong>{cyclist.finalValue}</strong></p>
                                <div style={{ width: "100%", height: "15px", backgroundColor: cyclist.teamColor, marginTop: "35px", marginLeft: "auto", marginRight: "auto" }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>  
        </main>
    );
}

export default SelectCyclistsBonus;