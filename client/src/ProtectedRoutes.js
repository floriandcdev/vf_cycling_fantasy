import { useAuth } from "./AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";

import ChooseLeague from "./components/ChooseLeague";
import CreateTeamPage from "./components/CreateTeamPage";
import Profil from "./components/Profil";
import Calendar from "./components/Calendar";
import Ranking from "./components/ProfilView/Ranking";

import createTeamConfig from "./config/createTeamConfig.json";

const isAfterDeadline = () => {
    const deadline = new Date(createTeamConfig.closeDate);
    const now = new Date();
    return now > deadline;
};

const ProtectedRoutes = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    const chooseLeagueElement = !user ? <Navigate to="/login" /> : isAfterDeadline() ? <Navigate to="/" /> : <ChooseLeague />;
    const createTeamElement = !user ? <Navigate to="/login" /> : isAfterDeadline() ? <Navigate to="/" /> : <CreateTeamPage />;

    return (
        <Routes>
            <Route path="/profil" element={user ? <Profil /> : <Navigate to="/login" />} />
            <Route path="/choose-league" element={chooseLeagueElement} />
            <Route path="/create-team/:teamId" element={createTeamElement} />
            <Route path="/calendar/:personal" element={user ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/ranking/" element={user ? <Ranking /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default ProtectedRoutes;