const logOut = async (req, res) => {
    res.clearCookie("accessToken");
    console.log("Utilisateur déconnecté, cookie effacé.");
    res.status(200).json({ message: "Déconnexion réussie" });
};

module.exports = logOut;