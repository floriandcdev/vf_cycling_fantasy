const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const userTeam = async (req, res) => {
    const userId = req.user.userId;
    const leagueId = req.params.leagueId;

    let connection;
    try {
        connection = await mysql.createConnection(config);

        const [selectedCyclists] = await connection.execute(`
            SELECT c.* FROM user_cyclists uc 
            JOIN cyclists c ON uc.cyclistId = c.cyclistId 
            WHERE uc.userId = ? AND uc.leagueId = ?
        `, [userId, leagueId]);

        const [cyclistsBonus] = await connection.execute(`
            SELECT c.* FROM user_cyclists uc 
            JOIN cyclists c ON uc.cyclistId = c.cyclistId 
            WHERE uc.userId = ? AND uc.isBonus = 1 AND uc.leagueId = ?
        `, [userId, leagueId]);

        const [selectedRaces] = await connection.execute(`
            SELECT r.* FROM user_races ur 
            JOIN races r ON ur.raceId = r.raceId 
            WHERE ur.userId = ? AND r.competition <> 'normal' AND ur.leagueId = ?
        `, [userId, leagueId]);

        const [bonusRaces] = await connection.execute(`
            SELECT r.* FROM user_races ur 
            JOIN races r ON ur.raceId = r.raceId 
            WHERE ur.UserId = ? AND ur.isBonus = 1 AND ur.leagueId = ?
        `, [userId, leagueId]);

        res.json({
            selectedCyclists,
            cyclistsBonus,
            selectedRaces,
            bonusRaces
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'équipe:", error);
        res.status(500).send("Erreur lors de la récupération des données de l'équipe");
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = userTeam;