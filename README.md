# Diagnostic Reprise Vélo - Decathlon

## Présentation

Ce projet a été réalisé dans le cadre du bloc de compétences **4.3 Web Development**.

L'application permet aux vendeurs Decathlon d'effectuer un diagnostic de reprise de vélo dans le cadre du programme **Seconde Vie**.

L'objectif est de standardiser les diagnostics, calculer automatiquement un score d'état du vélo et générer une offre de reprise cohérente.

---

## Fonctionnalités

### Authentification vendeur

* Connexion sécurisée via identifiant et mot de passe
* Vérification des identifiants côté serveur
* Hashage des mots de passe avec bcrypt

### Diagnostic guidé

Le vendeur répond à plusieurs critères :

* Cadre & Structure
* Freins
* Transmission
* Roues & Pneus
* État fonctionnel

Chaque réponse influence le score final du vélo.

### Calcul automatique

Le système :

* Calcule un score sur 100
* Applique des pondérations métier
* Estime les frais de remise en état
* Génère automatiquement une offre de reprise

### Règle métier critique

Si le cadre présente une fissure ou une déformation :

* Reprise refusée automatiquement

---

## Architecture technique

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Sécurité

* bcryptjs
* Authentification vendeur
* Validation des formulaires

---

## Structure du projet

```text
diagnostic-reprise-decathlon/
│
├── assets/
│   └── images/
│
├── backend/
│   ├── server.js
│   ├── users.json
│   ├── package.json
│   └── node_modules/
│
├── documentation/
│   └── figma/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── MCD.png
```

---

## Moteur de scoring

| Catégorie             | Pondération |
| --------------------- | ----------- |
| Cadre & Structure     | 30 %        |
| Freins & Transmission | 25 %        |
| Roues & Pneus         | 20 %        |
| Fonctionnel           | 25 %        |

Décisions :

* Score ≥ 80 → Reprise validée
* Score entre 60 et 79 → Reprise conditionnelle
* Score < 60 → Reprise refusée
* Cadre fissuré → Refus automatique

---

## Modélisation

Le projet s'appuie sur un MCD comprenant :

* Magasin
* Vendeur
* Client
* Vélo
* Pré-estimation
* Diagnostic
* Réponse diagnostic
* Offre de reprise

La pré-estimation permet au vendeur de récupérer les informations renseignées par un client avant son passage en magasin.

---

## Lancement du projet

### Frontend

Depuis la racine du projet :

```bash
python3 -m http.server 8000
```

Puis ouvrir :

```text
http://localhost:8000
```

### Backend

Depuis le dossier backend :

```bash
npm install
node server.js
```

Le serveur est accessible sur :

```text
http://localhost:3000
```

---

## Auteur

Fabrice-Etienne ONDO-MBA

Bachelor Chef de Projets Digitaux – EEMI
