import React, { useEffect, useState } from "react";

import "../styles/SelectRaces.css";

import createTeamConfig from "../../config/createTeamConfig.json";
import defaultCalendarConfig from "../../config/defaultCalendarConfig.json";

import cancelIcon from "../../medias/png/icons/cancel.png";

const SelectRaces = ({ selectedRaces, setSelectedRaces, setBonusRaces, bonusRaces, races, nextStep, prevStep }) => {
    const [categoryChoice, setCategoryChoice] = useState("UCI");
    const [selectedCount, setSelectedCount] = useState({ "1": 0, "2": 0, "3": 0 });
    const filteredRaces = races.filter(race => [1, 2, 3].includes(race.groupCompetitionId));
    const firstLineRaces = selectedRaces.filter((_, index) => index % 2 === 0);
    const secondLineRaces = selectedRaces.filter((_, index) => index % 2 !== 0);
    const [calendarDefaultValue, setCalendarDefaultValue] = useState("aucun");

    useEffect(() => {
        const initialCount = { "1": 0, "2": 0, "3": 0 };
        selectedRaces.forEach(race => {
            if (race.groupCompetitionId in initialCount) {
                initialCount[race.groupCompetitionId]++;
            }
        });
        setSelectedCount(initialCount);
    }, [selectedRaces]);

    const handleSelectRace = (race) => {
        const competition = race.groupCompetitionId;
    
        if (selectedRaces.some(selected => selected.raceId === race.raceId)) {
            setSelectedRaces(selectedRaces.filter(r => r.raceId !== race.raceId));
            setSelectedCount({ ...selectedCount, [competition]: selectedCount[competition] - 1 });

            if (bonusRaces.some(br => br.raceId === race.raceId)) {
                setBonusRaces(bonusRaces.filter(br => br.raceId !== race.raceId));
            }
        } else {
            setSelectedRaces([...selectedRaces, race]);
            setSelectedCount({ ...selectedCount, [competition]: selectedCount[competition] + 1 });
        }
    };

    const getMaxSelection = (competitionNumber) => {
        return createTeamConfig["racesNumber"][competitionNumber] || 0;
    };

    const isRaceSelected = raceId => {
        return selectedRaces.some(race => race.raceId === raceId);
    };

    const categoryCompetitionNumber = categoryChoice === "UCI" ? "1" : "2";

    const allRacesSelected = Object.keys(selectedCount)
        .filter(key => key === categoryCompetitionNumber)
        .every(key => selectedCount[key] === getMaxSelection(key));

    const groupRacesByCompetition = () => {
        return filteredRaces.reduce((groups, race) => {
            const groupKey = race.groupCompetitionId;
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    label: race.competition,
                    filteredRaces: []
                };
            }
            groups[groupKey].filteredRaces.push(race);
            return groups;
        }, {});
    };

    const handlePrevStep = () => {
        if (categoryChoice === "UCI") {
            prevStep();
        } else {
            setCategoryChoice("UCI");
        }
    };

    const handleNextStep = () => {
        if (categoryChoice === "UCI") {
            setCategoryChoice("CONTINENTAL");
        } else {
            nextStep();
        }
    };

    const racesByCompetition = groupRacesByCompetition();

    const handleDefaultCalendar = (event) => {
        const selectedCalendar = event.target.value;

        if (selectedCalendar !== "aucun") {
            setCalendarDefaultValue(selectedCalendar);
        
            setBonusRaces([]);
            setSelectedCount({}); 
        
            const defaultRaceIds = defaultCalendarConfig[selectedCalendar];
            const defaultRaces = filteredRaces.filter(race => defaultRaceIds.includes(race.raceId));
            setSelectedRaces(defaultRaces);
        }
    };

    return (
        <main className="select-races">
            <div className="select-races-shadow-container">
                <div className="select-races-title">
                    <h1>CRÉER SON ÉQUIPE - CHOIX DES COURSES ({categoryChoice === "UCI" ? "1" : "2"}/2)</h1>
                    <div className="select-races-shadow-mask-right"></div>
                    <div className="select-races-shadow-mask-bottom"></div>
                </div>
            </div>
            <div className="select-races-header">
                <div className="select-races-rules">
                    <p >Sélectionnez vos courses {categoryChoice === "UCI" ? "UCI PRO SERIES" : "Continental TOUR"}</p>
                </div>
                <div className="select-races-change-step">
                    <button onClick={handlePrevStep}>PRÉCÉDENT</button>
                    <button onClick={handleNextStep} disabled={!allRacesSelected}>SUIVANT</button>
                </div> 
            </div>
            {Object.keys(racesByCompetition).map(competitionNumber => {
                if ((categoryChoice === "UCI" && competitionNumber !== "1") || (categoryChoice !== "UCI" && competitionNumber !== "2")) {
                    return null;
                }

                return (
                    <div key={competitionNumber} className="select-races-pannel-view">                    
                        <div className="select-races-choice">
                            <div className="select-races-controls">
                                <div className="select-races-sort-control">
                                    <label>Calendrier par défaut</label>
                                    <select value={calendarDefaultValue} onChange={handleDefaultCalendar}>
                                        <option value="aucun">Aucun</option>
                                        <option value="france">France Belgique</option>
                                        <option value="world">Mondial</option>
                                        <option value="balance">Équilibré</option>
                                    </select>
                                </div>
                            </div>
                            <div className="select-races-table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>NOM DE LA COURSE</th>
                                            <th>CATÉGORIE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {racesByCompetition[competitionNumber].filteredRaces.map(race => (
                                            <tr key={race.raceId} onClick={() => handleSelectRace(race)} className={isRaceSelected(race.raceId) ? "select-races-table-selected-row" : ""}>
                                                <td>{race.name}</td>
                                                <td>{race.category}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="select-races-choice-view">
                            <p className="select-races-selected-number">
                            Courses sélectionnées : 
                                <span className={
                                    selectedRaces
                                        .filter(race => race.groupCompetitionId === parseInt(competitionNumber) && ((categoryChoice === "UCI" && competitionNumber === "1") || (categoryChoice !== "UCI" && competitionNumber === "2")))
                                        .length === createTeamConfig["racesNumber"][competitionNumber] ? "select-races-selected-races-green" : "select-races-selected-races-red"
                                }>
                                    {selectedRaces
                                        .filter(race => race.groupCompetitionId === parseInt(competitionNumber) && ((categoryChoice === "UCI" && competitionNumber === "1") || (categoryChoice !== "UCI" && competitionNumber === "2")))
                                        .length
                                    }
                                </span>
                                /{createTeamConfig["racesNumber"][competitionNumber]}
                            </p>
                            <div className="select-races-scroll-container">
                                <div className="select-races-line-container">
                                    {firstLineRaces
                                        .filter(race => race.groupCompetitionId === parseInt(competitionNumber) &&
                                        ((categoryChoice === "UCI" && competitionNumber === "1") || (categoryChoice !== "UCI" && competitionNumber === "2")))
                                        .map(filteredRace => (
                                            <div className="select-races-selected-cell" key={filteredRace.raceId}>            
                                                <div className="select-races-selected-info">
                                                    <img src={cancelIcon} alt="Icone de suppression" width="17" height="17" onClick={() => handleSelectRace(filteredRace)} />
                                                    <h4>{filteredRace.name}</h4>
                                                    <p>{filteredRace.category}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="select-races-line-container">
                                    {secondLineRaces
                                        .filter(race => race.groupCompetitionId === parseInt(competitionNumber) &&
                                        ((categoryChoice === "UCI" && competitionNumber === "1") || (categoryChoice !== "UCI" && competitionNumber === "2")))
                                        .map(filteredRace => (
                                            <div className="select-races-selected-cell" key={filteredRace.raceId}>            
                                                <div className="select-races-selected-info">
                                                    <img src={cancelIcon} alt="Icone de suppression" width="17" height="17" onClick={() => handleSelectRace(filteredRace)} />
                                                    <h4>{filteredRace.name}</h4>
                                                    <p>{filteredRace.category}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}            
        </main>
    );
}

export default SelectRaces;