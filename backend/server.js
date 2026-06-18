const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const users = require("./users.json");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const { identifiant, password } = req.body;

  if (!identifiant || !password) {
    return res.status(400).json({
      success: false,
      message: "Identifiant et mot de passe obligatoires."
    });
  }

  const user = users.find((u) => u.identifiant === identifiant);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Identifiants incorrects."
    });
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    return res.status(401).json({
      success: false,
      message: "Identifiants incorrects."
    });
  }

  return res.json({
    success: true,
    message: "Connexion réussie.",
    user: {
      id: user.id,
      identifiant: user.identifiant,
      nom: user.nom,
      role: user.role
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});