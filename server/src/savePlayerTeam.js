const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");
const closeDate = require("../config/closeDate.json");

const savePlayerTeam = async (req, res) => {
    const now = new Date();
    const deadline = new Date(closeDate.closeDate);
    if (now > deadline) {
        return res.status(403).json({ message: "La création d'une équipe n'est plus autorisée après le 17 janvier 2024." });
    }
    
    let connection;
    try {
        connection = await mysql.createConnection(config);
        await connection.beginTransaction();

        const { selectedCyclists, cyclistsBonus, selectedRaces, bonusRaces, teamId } = req.body;
        const userId = req.user.userId;

        await connection.execute("DELETE FROM user_cyclists WHERE userId = ? AND teamId = ?", [userId, teamId]);
        await connection.execute("DELETE FROM user_races WHERE userId = ? AND teamId = ?", [userId, teamId]);

        const insertCyclistQuery = "INSERT INTO user_cyclists (userId, cyclistId, isBonus, teamId) VALUES (?, ?, ?, ?)";
        const insertRaceQuery = "INSERT INTO user_races (userId, raceId, isBonus, teamId) VALUES (?, ?, ?, ?)";

        // Insérer les cyclistes
        for (const cyclist of selectedCyclists) {
            const isBonus = cyclistsBonus.some(c => c.cyclistId === cyclist.cyclistId);
            await connection.execute(insertCyclistQuery, [userId, cyclist.cyclistId, isBonus, teamId]);
        }

        // Insérer les courses
        for (const race of selectedRaces) {
            const isBonus = bonusRaces.some(br => br.raceId === race.raceId);
            await connection.execute(insertRaceQuery, [userId, race.raceId, isBonus, teamId]);
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