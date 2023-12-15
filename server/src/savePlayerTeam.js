const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const savePlayerTeam = async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        await connection.beginTransaction();

        const { selectedCyclists, cyclistsBonus, selectedRaces, bonusRaces, leagueId } = req.body;
        const userId = req.user.userId;

        // Vérification de l'existence de l'équipe
        const [existingEntries] = await connection.execute("SELECT * FROM user_cyclists WHERE userId = ? AND leagueId = ? LIMIT 1", [userId, leagueId]);
        if (existingEntries.length > 0) {
            // Suppression des données existantes
            await connection.execute("DELETE FROM user_cyclists WHERE userId = ? AND leagueId = ?", [userId, leagueId]);
            await connection.execute("DELETE FROM user_races WHERE userId = ? AND leagueId = ?", [userId, leagueId]);
            await connection.execute("DELETE FROM leagues WHERE userId = ? AND leagueId = ?", [userId, leagueId]);
        }

        const insertCyclistQuery = "INSERT INTO user_cyclists (userId, cyclistId, isBonus, leagueId) VALUES (?, ?, ?, ?)";
        const insertRaceQuery = "INSERT INTO user_races (userId, raceId, isBonus, leagueId) VALUES (?, ?, ?, ?)";

        let leagueLabel;
        if (leagueId === 0) {
            leagueLabel = "Ligue Général"
        } else if (leagueId === 1) {
            leagueLabel = "Néo Ligue"
        } else {
            leagueLabel = "Ligue n° : " + leagueId;
        }

        const insertLeagueQuery = "INSERT INTO leagues (userId, leagueId, leagueLabel) VALUES (?, ?, ?)";

        // Insérer les cyclistes
        for (const cyclist of selectedCyclists) {
            const isBonus = cyclistsBonus.some(c => c.cyclistId === cyclist.cyclistId);
            await connection.execute(insertCyclistQuery, [userId, cyclist.cyclistId, isBonus, leagueId]);
        }

        // Insérer les courses
        for (const race of selectedRaces) {
            const isBonus = bonusRaces.some(br => br.raceId === race.raceId);
            await connection.execute(insertRaceQuery, [userId, race.raceId, isBonus, leagueId]);
        }

        await connection.execute(insertLeagueQuery, [userId, leagueId, leagueLabel]);

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