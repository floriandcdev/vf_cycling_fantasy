const mysql = require("mysql2/promise");
const config = require("../config/mysqlConfig.json");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const googleConfig = require("../config/googleConfig");

const generateResetToken = async () => {
    const randomBytes = crypto.randomBytes(20).toString("hex");
    const hashedToken = await bcrypt.hash(randomBytes, 10);
    return hashedToken;
};

const sendResetEmail = async (email, resetToken) => {
    const transporter = nodemailer.createTransport({service: "gmail",
        auth: {
            user: googleConfig.id.email,
            pass: googleConfig.id.password
        },
        debug: true,
        logger: true
    });

    const resetUrl = `https://vf-fantasy-cyclisme.velofute.com//reset-password?token=${resetToken}`;

    const mailOptions = {
        from: googleConfig.id.email,
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant: <a href="${resetUrl}">${resetUrl}</a></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email de réinitialisation envoyé à:", email);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
    }
};

const askResetPassword = async (req, res) => {
    const { email } = req.body;

    let connection;

    try {
        connection = await mysql.createConnection(config);

        const userQuery = "SELECT * FROM users WHERE email = ?";
        const [user] = await connection.execute(userQuery, [email]);

        if (user.length === 0) {
            return res.status(403).json({ message: "Échec restauration" });
        }

        const resetToken = await generateResetToken();
        
        const tokenQuery = "UPDATE users SET resetToken = ? WHERE email = ?";
        await connection.execute(tokenQuery, [resetToken, email]);

        sendResetEmail(email, resetToken);

        res.status(200).json({ message: "Email de réinitialisation envoyé." });
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = askResetPassword;