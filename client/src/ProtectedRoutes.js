import { useAuth } from "./AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";

import ChooseLeague from "./components/ChooseLeague";
import CreateTeamPage from "./components/CreateTeamPage";
import Profil from "./components/Profil";
import Calendar from "./components/Calendar";
import Ranking from "./components/ProfilView/Ranking";


const ProtectedRoutes = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <Routes>
            <Route path="/profil" element={user ? <Profil /> : <Navigate to="/login" />} />
            <Route path="/choose-league" element={user ? <ChooseLeague /> : <Navigate to="/login" />} />
            <Route path="/create-team/:teamId" element={user ? <CreateTeamPage /> : <Navigate to="/login" />} />
            <Route path="/calendar/:personal" element={user ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/ranking/" element={user ? <Ranking /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default ProtectedRoutes;