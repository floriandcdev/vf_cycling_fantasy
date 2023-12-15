import React from "react";

import "../styles/SelectBonusRaces.css";

import cancelIcon from "../../medias/png/icons/cancel.png";

const SelectBonusRace = ({ selectedRaces, setBonusRaces, bonusRaces, races, nextStep, prevStep }) => {
    const bonusEligibleRaces = races.filter(race => race.competition_number === 0);
    const combinedRaces = [...selectedRaces, ...bonusEligibleRaces];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };

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

    return (
        <main className="select-races-bonus">
            <div className="select-races-bonus-title">
                <h1>5 - Je choisis mes objectifs de saison</h1>
            </div>
            <div className="select-races-bonus-header">
                <div className="select-races-bonus-rules">
                    <p >Sélectionnez vos courses bonus : leurs points points compteront double.</p>
                </div>
                <div className="select-races-bonus-change-step">
                    <button onClick={prevStep}>Précédent</button>
                    <button onClick={nextStep} disabled={bonusRaces.length !== 3}>Suivant</button>
                </div>  
            </div>
            <div className="select-races-bonus-pannel-view">
                <div className="select-races-bonus-choice">
                    <div className="select-races-bonus-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Départ</th>
                                    <th>Arrivé</th>
                                    <th>Nom de la course</th>
                                    <th>Catégorie</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combinedRaces.map((race) => (
                                    <tr key={race.raceId} onClick={() => handleSelectBonusRace(race)} className={isBonusRaceSelected(race.raceId) ? "select-races-bonus-table-selected-row" : ""}>
                                        <td>{formatDate(race.date_start)}</td>
                                        <td>{formatDate(race.date_end)}</td>
                                        <td>{race.name}</td>
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
                                    <img src={cancelIcon} alt="Icone de suppression" width="17" height="17" onClick={() => handleSelectBonusRace(race)} />
                                    <h4>{race.name}</h4>
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