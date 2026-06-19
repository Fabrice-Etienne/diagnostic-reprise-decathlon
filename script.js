const screens = document.querySelectorAll(".screen");
const navigationButtons = document.querySelectorAll("[data-next]");
const selectableCards = document.querySelectorAll(".choice-card, .answer-card");
const loginButton = document.getElementById("login-btn");

const diagnostic = {
  cadre: { score: 85, frais: 0, label: "Rayures superficielles" },
  freins: { score: 80, frais: 12, label: "Patins usés à remplacer" },
  transmission: { score: 100, frais: 0, label: "Fluide · Chaîne et dérailleur OK" },
  pneus: { score: 80, frais: 18, label: "Un pneu à changer" },
  roues: { score: 100, frais: 0, label: "Droites · Pas de voile" },
  fonctionnel: { score: 80, frais: 8, label: "Réglages mineurs nécessaires" }
};

const valeurBase = 145;
const estimationEnLigne = 150;
const fraisFixes = 8;

const scoringRules = {
  "Aucun défaut visible": { group: "cadre", score: 100, frais: 0 },
  "Rayures superficielles": { group: "cadre", score: 85, frais: 0 },
  "Choc ou corrosion légère": { group: "cadre", score: 60, frais: 15 },
  "Fissure ou déformation": { group: "cadre", score: 0, frais: 0 },

  "Efficace · Aucun remplacement": { group: "freins", score: 100, frais: 0 },
  "Patins usés à remplacer": { group: "freins", score: 80, frais: 12 },
  "Freinage défaillant": { group: "freins", score: 40, frais: 10 },

  "Fluide · Chaîne et dérailleur OK": { group: "transmission", score: 100, frais: 0 },
  "Dérailleur à régler": { group: "transmission", score: 75, frais: 15 },
  "Chaîne + cassette usées": { group: "transmission", score: 50, frais: 25 },

  "Bon état · Usure normale": { group: "pneus", score: 100, frais: 0 },
  "Un pneu à changer": { group: "pneus", score: 80, frais: 18 },
  "Les deux pneus à changer": { group: "pneus", score: 50, frais: 35 },

  "Droites · Pas de voile": { group: "roues", score: 100, frais: 0 },
  "Léger voile à corriger": { group: "roues", score: 75, frais: 10 },

  "Rien à signaler · Tout opérationnel": { group: "fonctionnel", score: 100, frais: 0 },
  "Réglages mineurs nécessaires": { group: "fonctionnel", score: 80, frais: 8 },
  "Plusieurs points à revoir": { group: "fonctionnel", score: 50, frais: 18 }
};

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const nextScreen = document.getElementById(screenId);

  if (nextScreen) {
    nextScreen.classList.add("active");

    document.querySelector(".app").scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (screenId === "recapitulatif" || screenId === "offre" || screenId === "confirmation") {
      updateResults();
    }
  }
}

function cleanText(text) {
  return text
    .replace(/−/g, "-")
    .replace(/-\d+\s?€/g, "")
    .replace(/[⊗▣📷]/g, "")
    .trim();
}

function calculateDiagnostic() {
  const cadreScore = diagnostic.cadre.score;
  const freinsTransmissionScore = Math.round(
    (diagnostic.freins.score + diagnostic.transmission.score) / 2
  );
  const rouesPneusScore = Math.round(
    (diagnostic.pneus.score + diagnostic.roues.score) / 2
  );
  const fonctionnelScore = diagnostic.fonctionnel.score;

  const scoreFinal = Math.round(
    cadreScore * 0.3 +
    freinsTransmissionScore * 0.25 +
    rouesPneusScore * 0.2 +
    fonctionnelScore * 0.25
  );

  const fraisVariables =
    diagnostic.cadre.frais +
    diagnostic.freins.frais +
    diagnostic.transmission.frais +
    diagnostic.pneus.frais +
    diagnostic.roues.frais +
    diagnostic.fonctionnel.frais;

  const totalFrais = fraisFixes + fraisVariables;

  const ajustementEtat = Math.round((scoreFinal - 75) * 0.6);

  const offreFinale = Math.max(0, valeurBase + ajustementEtat - totalFrais);

  let decision = "Reprise validée";
  let message = "Le vélo est éligible au programme Seconde Vie.";

  if (scoreFinal < 60) {
    decision = "Reprise refusée";
    message = "Le vélo nécessite trop de réparations pour être repris.";
  } else if (scoreFinal < 80) {
    decision = "Reprise conditionnelle";
    message = "Le vélo peut être repris sous réserve de validation atelier.";
  }

  return {
    cadreScore,
    freinsTransmissionScore,
    rouesPneusScore,
    fonctionnelScore,
    scoreFinal,
    totalFrais,
    ajustementEtat,
    offreFinale,
    decision,
    message,
    ecartPrix: estimationEnLigne - offreFinale
  };
}

function updateText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function updateResults() {
  const result = calculateDiagnostic();

  updateText(".score-circle", `${result.scoreFinal} / 100`);

  const scoreLines = document.querySelectorAll(".score-line b");

  if (scoreLines.length >= 4) {
    scoreLines[0].textContent = `${result.cadreScore} / 100`;
    scoreLines[1].textContent = `${result.freinsTransmissionScore} / 100`;
    scoreLines[2].textContent = `${result.rouesPneusScore} / 100`;
    scoreLines[3].textContent = `${result.fonctionnelScore} / 100`;
  }

  const bars = document.querySelectorAll(".bar span");

  if (bars.length >= 4) {
    bars[0].style.width = `${result.cadreScore}%`;
    bars[1].style.width = `${result.freinsTransmissionScore}%`;
    bars[2].style.width = `${result.rouesPneusScore}%`;
    bars[3].style.width = `${result.fonctionnelScore}%`;
  }

  const totalFees = document.querySelector(".info-line.total strong");

  if (totalFees) {
    totalFees.textContent = `−${result.totalFrais} €`;
  }

  const decisionTitle = document.querySelector(".decision-card strong");
  const decisionMessage = document.querySelector(".decision-card p");

  if (decisionTitle && decisionMessage) {
    decisionTitle.textContent = result.decision;
    decisionMessage.textContent = result.message;
  }

  const priceBlocks = document.querySelectorAll(".price-row strong");

  if (priceBlocks.length >= 2) {
    priceBlocks[0].textContent = `${estimationEnLigne} €`;
    priceBlocks[1].textContent = `${result.offreFinale} €`;
  }

  const note = document.querySelector(".note");

  if (note) {
    note.textContent = `L’écart de ${result.ecartPrix} € correspond aux frais réels de remise en état et à l’ajustement selon l’état constaté.`;
  }

  const calculationLines = document.querySelectorAll("#offre .info-line strong");

  if (calculationLines.length >= 3) {
    calculationLines[0].textContent = `${valeurBase} €`;
    calculationLines[1].textContent = `${result.ajustementEtat >= 0 ? "+" : ""}${result.ajustementEtat} €`;
    calculationLines[2].textContent = `−${result.totalFrais} €`;
  }

  const offerBannerPrice = document.querySelector(".offer-banner strong");

  if (offerBannerPrice) {
    offerBannerPrice.textContent = `${result.offreFinale} €`;
  }

  const finalPrice = document.querySelector(".final-card b");

  if (finalPrice) {
    finalPrice.textContent = `${result.offreFinale} €`;
  }
}

navigationButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showScreen(button.dataset.next);
  });
});

selectableCards.forEach((card) => {
  card.addEventListener("click", () => {
    const parent = card.parentElement;
    const cardsInSameGroup = parent.querySelectorAll(".choice-card, .answer-card");

    cardsInSameGroup.forEach((item) => {
      item.classList.remove("active");
    });

    card.classList.add("active");

  const group = card.dataset.group;
  const score = Number(card.dataset.score);
  const frais = Number(card.dataset.fee);

  if (group) {
    diagnostic[group] = {
      score: score,
      frais: frais,
      label: card.textContent.trim()
    };

    updateResults();
  }
  });
});

if (loginButton) {
  loginButton.addEventListener("click", async () => {
    const identifiant = document.getElementById("identifiant").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifiant,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("vendeur", JSON.stringify(data.user));
      showScreen("dashboard");
    } catch (error) {
      alert("Impossible de contacter le serveur.");
      console.error(error);
    }
  });
}

updateResults();