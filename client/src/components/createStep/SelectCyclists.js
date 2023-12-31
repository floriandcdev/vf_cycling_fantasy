import React, { useEffect, useState } from "react";

import createTeamConfig from "../../config/createTeamConfig.json";

import "../styles/SelectCyclists.css";

const SelectCyclists = ({ numberPlayerSelected, setNumberPlayerSelected, budget, setBudget, selectedCyclists, setSelectedCyclists, setCyclistsBonus, cyclistsBonus, cyclists, teamId, nextStep }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const firstLineCyclists = selectedCyclists.filter((_, index) => index % 2 === 0);
    const secondLineCyclists = selectedCyclists.filter((_, index) => index % 2 !== 0);
    const [cyclistsList, setCyclistsList] = useState(cyclists);
    const [selectedSortValue, setSelectedSortValue] = useState("value");
    const teamLabel = teamId === 1 ? "cyclistsWorldTourNumber" : "cyclistsNeoProNumber";

    useEffect(() => {
        setCyclistsList(cyclists);
    }, [cyclists]);

    const handleSelectCyclist = cyclist => {
        if (selectedCyclists.some(selected => selected.cyclistId === cyclist.cyclistId)) {
            setSelectedCyclists(selectedCyclists.filter(selected => selected.cyclistId !== cyclist.cyclistId));
            setBudget(budget + cyclist.finalValue);
            setNumberPlayerSelected(numberPlayerSelected - 1);
    
            if (cyclistsBonus.some(changeable => changeable.cyclistId === cyclist.cyclistId)) {
                setCyclistsBonus(cyclistsBonus.filter(changeable => changeable.cyclistId !== cyclist.cyclistId));
            }
        } else if (budget >= cyclist.finalValue) {
            setSelectedCyclists([...selectedCyclists, cyclist]);
            setBudget(budget - cyclist.finalValue);
            setNumberPlayerSelected(numberPlayerSelected + 1);
        }
    };

    const isCyclistSelected = cyclistId => {
        const isSelected = selectedCyclists.some(selected => selected.cyclistId === cyclistId);
        return isSelected;
    };

    const isButtonDisabled = selectedCyclists.length < createTeamConfig[teamLabel].min || selectedCyclists.length > createTeamConfig[teamLabel].max;

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
    
        if (newSearchTerm) {
            const filteredCyclists = cyclists.filter(cyclist =>
                cyclist.name.toLowerCase().startsWith(newSearchTerm.toLowerCase())
            );
            sortCyclists(selectedSortValue, filteredCyclists);
        } else {
            sortCyclists(selectedSortValue, cyclists);
        }
    };

    const handleSortChange = (event) => {
        const sortBy = event.target.value;
        setSelectedSortValue(sortBy);

        sortCyclists(sortBy, cyclistsList);
    };

    const sortCyclists = (sortBy, sortedCyclists) => {
        switch (sortBy) {
            case "value":
                sortedCyclists.sort((a, b) => b.finalValue - a.finalValue);
                break;
            case "nation":
                sortedCyclists.sort((a, b) => a.nationality.localeCompare(b.nationality));
                break;
            case "team":
                sortedCyclists.sort((a, b) => a.team.localeCompare(b.team));
                break;
            default:
        }
        setCyclistsList(sortedCyclists);
    };

    return (
        <main className="select-cyclists">
            <div className="select-cyclists-shadow-container">
                <div className="select-cyclists-title">
                    <h1>CRÉER SON ÉQUIPE - CHOIX DES COUREURS</h1>
                    <div className="select-cyclists-shadow-mask-right"></div>
                    <div className="select-cyclists-shadow-mask-bottom"></div>
                </div>
            </div>
            <div className="select-cyclists-rules">
                <p >Sélectionnez entre {createTeamConfig[teamLabel].min} et {createTeamConfig[teamLabel].max} joueurs</p>
            </div>

            <div className="select-cyclists-pannel-view">
                <div className="select-cyclists-choice">
                    <div className="select-cyclists-header-pannel">
                        <div className="select-cyclists-header-pannel-content">
                            <p>Nombre de joueurs sélectionnés : <span>{numberPlayerSelected}</span></p>
                        </div>                
                        <div className="select-cyclists-header-pannel-content">
                            <p>Budget restant : <strong>{budget}M</strong></p>
                        </div>
                    </div>
                    <div className="select-cyclists-controls">
                        <div className="select-cyclists-sort-control">
                            <label>Trier par</label>
                            <select onChange={handleSortChange}>
                                <option value="value">Valeur</option>
                                <option value="nation">Nation</option>
                                <option value="team">Équipe</option>
                            </select>
                        </div>
                        <div className="select-cyclists-search-control">
                            <img src={`${process.env.PUBLIC_URL}/icons/loupe.png`} alt="Icone d'une loupe" width="22" height="22" className="select-cyclists-search-icon" />
                            <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Rechercher par nom" />
                        </div>
                    </div>
                    <div className="select-cyclists-table-container">
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
                                {cyclistsList.map((cyclist) => (
                                    <tr key={cyclist.cyclistId} onClick={() => handleSelectCyclist(cyclist)} className={isCyclistSelected(cyclist.cyclistId) ? "select-cyclists-table-selected-row" : ""}>
                                        <td>
                                            <div className="select-cyclists-name-info">
                                                <img 
                                                    className="select-cyclists-flag-icon"
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
                
                <div className="select-cyclists-choice-view">
                <div className="select-cyclists-next">
                    <button onClick={nextStep} disabled={isButtonDisabled}>VALIDER</button>
                </div>
                    <div className="select-cyclists-scroll-container">
                        <div className="select-cyclists-line-container">
                            {firstLineCyclists.map((cyclist) => (
                                <div className="select-cyclists-selected-cell" key={cyclist.cyclistId}>
                                    <img src={`${process.env.PUBLIC_URL}/icons/cancel.png`} className="select-cyclists-cancel-icon" alt="Icone de suppression" width="17" height="17" onClick={() => handleSelectCyclist(cyclist)} />
                                    <div className="select-cyclists-selected-info">                                        
                                        <h4>
                                            <img 
                                                className="select-cyclists-flag-icon"
                                                src={`${process.env.PUBLIC_URL}/flags/${cyclist.nationality.replace(/ /g, '_').toLowerCase()}.png`} 
                                                alt={`Drapeau de ${cyclist.nationality}`} 
                                                width="20" 
                                                height="20"
                                            />
                                            {cyclist.name}</h4>
                                        <p>{cyclist.team}</p>
                                        <p>Valeur : <strong>{cyclist.finalValue}</strong></p>
                                        <div style={{ width: "100%", height: "15px", backgroundColor: cyclist.teamColor, marginTop: "35px", marginLeft: "auto", marginRight: "auto" }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="select-cyclists-line-container">
                            {secondLineCyclists.map((cyclist) => (
                                <div className="select-cyclists-selected-cell" key={cyclist.cyclistId}>            
                                    <img src={`${process.env.PUBLIC_URL}/icons/cancel.png`} className="select-cyclists-cancel-icon" alt="Icone de suppression" width="17" height="17" onClick={() => handleSelectCyclist(cyclist)} />
                                    <div className="select-cyclists-selected-info">
                                        <h4>
                                            <img 
                                                className="select-cyclists-flag-icon"
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
                </div>              
            </div>            
        </main>
    );        
}

export default SelectCyclists;