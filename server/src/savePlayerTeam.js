const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const savePlayerTeam = async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        await connection.beginTransaction();

        const { selectedCyclists, cyclistsBonus, selectedRaces, bonusRaces, leagueId, teamId } = req.body;
        const userId = req.user.userId;

        const [existingEntries] = await connection.execute("SELECT * FROM user_leagues_teams WHERE userId = ? AND leagueId = ? AND teamId = ?", [userId, leagueId, teamId]);
        if (existingEntries.length > 0) {
            await connection.execute("DELETE FROM user_cyclists WHERE userId = ? AND leagueId = ? AND teamId = ?", [userId, leagueId, teamId]);
            await connection.execute("DELETE FROM user_races WHERE userId = ? AND leagueId = ? AND teamId = ?", [userId, leagueId, teamId]);
        } else {
            const insertLeagueQuery = "INSERT INTO user_leagues_teams (userId, leagueId, teamId) VALUES (?, ?, ?)";
            await connection.execute(insertLeagueQuery, [userId, leagueId, teamId]);
        }

        const insertCyclistQuery = "INSERT INTO user_cyclists (userId, cyclistId, isBonus, leagueId, teamId) VALUES (?, ?, ?, ?, ?)";
        const insertRaceQuery = "INSERT INTO user_races (userId, raceId, isBonus, leagueId, teamId) VALUES (?, ?, ?, ?, ?)";

        // Insérer les cyclistes
        for (const cyclist of selectedCyclists) {
            const isBonus = cyclistsBonus.some(c => c.cyclistId === cyclist.cyclistId);
            await connection.execute(insertCyclistQuery, [userId, cyclist.cyclistId, isBonus, leagueId, teamId]);
        }

        // Insérer les courses
        for (const race of selectedRaces) {
            const isBonus = bonusRaces.some(br => br.raceId === race.raceId);
            await connection.execute(insertRaceQuery, [userId, race.raceId, isBonus, leagueId, teamId]);
        }

        

        await connection.commit();
        res.status(200).json({ message: "L'équipe du joueur a été enregistrée avec succès." });
    } catch (error) {
        await connection.rollback();
        console.error("Erreur lors de l'enregistrement de l'équipe du joueur:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = savePlayerTeam;