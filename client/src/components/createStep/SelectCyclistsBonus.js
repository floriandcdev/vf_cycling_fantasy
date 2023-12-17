import React from "react";

import "../styles/SelectCyclistsBonus.css";

import cancelIcon from "../../medias/png/icons/cancel.png";

const SelectCyclistsBonus = ({ selectedCyclists, setCyclistsBonus, cyclistsBonus, nextStep, prevStep }) => {
    
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

    return (
        <main className="select-cyclists-bonus">
            <div className="select-cyclists-bonus-title">
                <h1>3 - Je choisis mon coureur bonus</h1>
            </div>
            <div className="select-cyclists-bonus-header">
                <div className="select-cyclists-bonus-rules">
                    <p >Sélectionnez votre cycliste bonus, ses points seront doublés.</p>
                </div>

                <div className="select-cyclists-bonus-change-step">
                    <button onClick={prevStep}>Précédent</button>
                    <button onClick={nextStep} disabled={cyclistsBonus.length !== 1}>Suivant</button>
                </div> 
            </div>

            <div className="select-cyclists-bonus-pannel-view">
                <div className="select-cyclists-bonus-choice">
                    <div className="select-cyclists-bonus-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Coureur</th>
                                    <th>Équipe</th>
                                    <th>Nation</th>
                                    <th>Valeur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCyclists.map((cyclist) => (
                                    <tr key={cyclist.cyclistId} onClick={() => handleCyclistsBonus(cyclist)} className={isCyclistsBonusSelected(cyclist.cyclistId) ? "select-cyclists-bonus-table-selected-row" : ""}>
                                        <td>
                                            <div className="select-cyclists-bonus-name-info">
                                                <img 
                                                    className="select-cyclists-bonus-flag-icon"
                                                    src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                                    alt={`Drapeau de ${cyclist.nationality}`} 
                                                    width="20" 
                                                    height="15"
                                                />
                                                <span>{cyclist.name}</span>
                                            </div>
                                        </td>
                                        <td>{cyclist.team}</td>
                                        <td>{cyclist.nationality}</td>
                                        <td>{cyclist.final_value}</td>
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
                                <img src={cancelIcon} className="select-cyclists-bonus-cancel-icon" alt="Icone de suppression" width="17" height="17" onClick={() => handleCyclistsBonus(cyclist)} />
                                <h4>
                                    <img 
                                        className="select-cyclists-bonus-flag-icon"
                                        src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                        alt={`Drapeau de ${cyclist.nationality}`} 
                                        width="20" 
                                        height="15"
                                    />
                                    {cyclist.name}
                                </h4>
                                <p>{cyclist.team}</p>
                                <p>Valeur : <strong>{cyclist.final_value}</strong></p>
                                <div style={{ width: "120px", height: "15px", backgroundColor: cyclist.teamColor, marginTop: "5px", marginLeft: "auto", marginRight: "auto" }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>  
        </main>
    );
}

export default SelectCyclistsBonus;