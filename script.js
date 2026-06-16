const screens = document.querySelectorAll(".screen");
const navigationButtons = document.querySelectorAll("[data-next]");
const selectableCards = document.querySelectorAll(".choice-card, .answer-card");

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const nextScreen = document.getElementById(screenId);

  if (nextScreen) {
    nextScreen.classList.add("active");
    document.querySelector(".app").scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
  });
});