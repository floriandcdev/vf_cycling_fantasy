import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

import SelectCyclists from "./createStep/SelectCyclists.js";
import SelectCyclistsBonus from "./createStep/SelectCyclistsBonus.js";
import SelectRaces from "./createStep/SelectRaces";
import SelectBonusRace from "./createStep/SelectBonusRace";
import ConfirmChoices from "./createStep/ConfirmChoices";

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
    const { leagueId } = useParams();
    const leagueIdNumber = parseInt(leagueId, 10);
    const { user } = useAuth();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const nextStep = () => {
        if (step < 6) {
            if (leagueIdNumber === 1 && step === 2) {
                setStep(step + 3);
            } else {
                setStep(step + 1);
            }
        }
    };

    const prevStep = () => {
        if (step > 1) {
            if (leagueIdNumber === 1 && step === 5) {
                setStep(step - 3);
            } else {
                setStep(step - 1);
            }
        }
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
                const response = await fetch(`${apiUrl}/cyclists-list/${leagueIdNumber}`);
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
        fetchRaces();

    }, [apiUrl, user, navigate, leagueIdNumber]);

    useEffect(() => {
        if (!user) {
            navigate("/logIn");
            return;
        }  

        const calculateInitialBudget = (totalBudget) => {
            const totalValueOfSelectedCyclists = selectedCyclists.reduce((total, selectedCyclist) => {
                const cyclist = cyclists.find(c => c.cyclistId === selectedCyclist.cyclistId);
                return total + (cyclist ? cyclist.final_value : 0);
            }, 0);
            
            return totalBudget - totalValueOfSelectedCyclists;
        };  

        const baseBudget = leagueIdNumber === 1 ? 66 : 500;

        const initialBudget = calculateInitialBudget(baseBudget);
        setBudget(initialBudget);

    }, [apiUrl, user, navigate, selectedCyclists, cyclists, leagueIdNumber]);

    useEffect(() => {
        if (!user) {
            navigate("/logIn");
            return;
        }         

        //Check if a user's team exists in the database
        const fetchTeamData = async () => {
            try {
                const response = await fetch(`${apiUrl}/userTeam/${leagueIdNumber}`, {
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
        
    }, [cyclists, apiUrl, user, navigate, leagueIdNumber]);

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
                nextStep={nextStep} 
                prevStep={prevStep}
            />
        );
        case 5:
        return (
            <ConfirmChoices 
                selectedCyclists={selectedCyclists} 
                cyclistsBonus={cyclistsBonus}
                races={races}
                selectedRaces={selectedRaces} 
                bonusRaces={bonusRaces}
                leagueId={leagueIdNumber}
                nextStep={nextStep} 
                prevStep={prevStep}
            />
        );
        case 6:
        return (
            <div>
                <p>Enregistrement confirmé</p>
                <Link to="/profil">Retour à la page d'accueil</Link>
            </div>
        );
        default:
        return <div>Étape non reconnue</div>;
    }
}

export default CreateTeamPage;