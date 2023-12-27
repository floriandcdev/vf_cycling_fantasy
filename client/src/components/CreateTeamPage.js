import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

import SelectCyclists from "./createStep/SelectCyclists.js";
import SelectCyclistsBonus from "./createStep/SelectCyclistsBonus.js";
import SelectRaces from "./createStep/SelectRaces";
import SelectBonusRace from "./createStep/SelectBonusRace";

const CreateTeamPage = () => {
    const [step, setStep] = useState(1);
    const [budget, setBudget] = useState();
    const [numberPlayerSelected, setNumberPlayerSelected] = useState(0);
    const [selectedCyclists, setSelectedCyclists] = useState([]);
    const [cyclistsBonus, setCyclistsBonus] = useState([]);
    const [selectedRaces, setSelectedRaces] = useState([]);
    const [bonusRaces, setBonusRaces] = useState([]);
    const [races, setRaces] = useState([]);
    const [cyclists, setCyclists] = useState([]);
    const params = useParams();
    const teamId = parseInt(params.teamId, 10);
    const { user } = useAuth();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const nextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    }; 

    const saveData = () => {
        return new Promise((resolve, reject) => {

            if (!user) {
                navigate("/logIn");
                reject("Utilisateur non connecté");
                return;
            }

            const obligatoryRaces = races.filter(race => race.groupCompetitionId === 0);

            const playerTeamData = {
                selectedCyclists,
                cyclistsBonus,
                selectedRaces: [...obligatoryRaces, ...selectedRaces],
                bonusRaces, 
                teamId
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
                resolve(data);
            })
            .catch((error) => {
                console.error("Error:", error);
                reject(error);
            });
        });
    };

    //useEffect
    useEffect(() => {
        if (!user) {
            navigate("/logIn");
            return;
        }

        //Get Cyclists List function
        const fetchCyclists = async () => {
            try {
                const response = await fetch(`${apiUrl}/cyclists-list/${teamId}`);
                const data = await response.json();
                setCyclists(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des cyclistes:', error);
            }
        };

        //Get Races List function
        const fetchRaces = async () => {
            try {
                const response = await fetch(`${apiUrl}/races-list`);
                const data = await response.json();
                setRaces(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des courses:', error);
            }
        };

        fetchCyclists();   
        if (teamId === 1) {   
            fetchRaces();
        }

    }, [apiUrl, user, navigate, teamId]);

    useEffect(() => {
        if (!user) {
            navigate("/logIn");
            return;
        }  

        const calculateInitialBudget = (totalBudget) => {
            const totalValueOfSelectedCyclists = selectedCyclists.reduce((total, selectedCyclist) => {
                const cyclist = cyclists.find(c => c.cyclistId === selectedCyclist.cyclistId);
                return total + (cyclist ? cyclist.finalValue : 0);
            }, 0);
            
            return totalBudget - totalValueOfSelectedCyclists;
        };  

        const baseBudget = teamId === 1 ? 500 : 66;

        const initialBudget = calculateInitialBudget(baseBudget);
        setBudget(initialBudget);

    }, [apiUrl, user, navigate, selectedCyclists, cyclists, teamId]);

    useEffect(() => {
        if (!user) {
            navigate("/logIn");
            return;
        }         

        //Check if a user's team exists in the database
        const fetchTeamData = async () => {
            try {
                const apiParams = new URLSearchParams({
                    teamId: teamId
                });

                const response = await fetch(`${apiUrl}/userTeam/?${apiParams.toString()}`, {
                    credentials: "include"
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la récupération des données de l'équipe: Statut ${response.status} - ${response.statusText}`);
                }
                
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'équipe:", error);
                throw error;
            }
        };
    
        //Execute the fetch's function
        const loadData = async () => {
            try {
                const teamDataExist = await fetchTeamData();

                if (teamDataExist) {                    
                    setSelectedCyclists(teamDataExist.selectedCyclists || []);
                    setCyclistsBonus(teamDataExist.cyclistsBonus || []);
                    setSelectedRaces(teamDataExist.selectedRaces || []);
                    setBonusRaces(teamDataExist.bonusRaces || []);
                    setNumberPlayerSelected(teamDataExist.selectedCyclists.length);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        };
    
        loadData();
        
    }, [cyclists, apiUrl, user, navigate, teamId]);

    // Gestion des données à chaque étape
    switch(step) {
        case 1:
        return (            
            <SelectCyclists 
                numberPlayerSelected={numberPlayerSelected}
                setNumberPlayerSelected={setNumberPlayerSelected}
                budget={budget} 
                setBudget={setBudget} 
                selectedCyclists={selectedCyclists} 
                setSelectedCyclists={setSelectedCyclists} 
                setCyclistsBonus={setCyclistsBonus}
                cyclistsBonus={cyclistsBonus}
                cyclists={cyclists}
                teamId={teamId}
                nextStep={nextStep} 
            />
        );
        case 2:
        return (
            <SelectCyclistsBonus 
                selectedCyclists={selectedCyclists} 
                setCyclistsBonus={setCyclistsBonus}
                cyclistsBonus={cyclistsBonus}
                nextStep={nextStep} 
                prevStep={prevStep}
                teamId={teamId}
                saveData={saveData}
            />
        );
        case 3:
        return (
            <SelectRaces 
                selectedRaces={selectedRaces} 
                setSelectedRaces={setSelectedRaces}
                setBonusRaces={setBonusRaces}
                bonusRaces={bonusRaces}
                races={races}
                nextStep={nextStep} 
                prevStep={prevStep}
            />
        );
        case 4:
        return (
            <SelectBonusRace 
                selectedRaces={selectedRaces} 
                setBonusRaces={setBonusRaces}
                bonusRaces={bonusRaces}
                races={races}
                prevStep={prevStep}
                saveData={saveData}
            />
        );
        default:
        return <div>Étape non reconnue</div>;
    }
}

export default CreateTeamPage;