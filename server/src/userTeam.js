const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");

const userTeam = async (req, res) => {
    const userId = req.user.userId;
    const leagueId = parseInt(req.query.leagueId, 10);
    const teamId = parseInt(req.query.teamId, 10);

    let connection;
    try {
        connection = await mysql.createConnection(config);

        const [selectedCyclists] = await connection.execute(`
            SELECT c.* FROM user_cyclists uc 
            JOIN cyclists c ON uc.cyclistId = c.cyclistId 
            WHERE uc.userId = ? AND uc.leagueId = ? AND teamId = ?
        `, [userId, leagueId, teamId]);

        const [cyclistsBonus] = await connection.execute(`
            SELECT c.* FROM user_cyclists uc 
            JOIN cyclists c ON uc.cyclistId = c.cyclistId 
            WHERE uc.userId = ? AND uc.isBonus = 1 AND uc.leagueId = ? AND teamId = ?
        `, [userId, leagueId, teamId]);

        if (teamId === 1) {
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
        } else {
            res.json({
                selectedCyclists,
                cyclistsBonus
            });
        }

        
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