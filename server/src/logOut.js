const logOut = async (req, res) => {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Déconnexion réussie" });
};

module.exports = logOut;