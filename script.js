const screens = document.querySelectorAll(".screen");
const navigationButtons = document.querySelectorAll("[data-next]");

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
    const nextScreenId = button.dataset.next;
    showScreen(nextScreenId);
  });
});