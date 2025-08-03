export const GlowEffect = () => {
  const cards = document.querySelectorAll(".glow");

  cards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
      card.classList.remove("fade-out");
      card.classList.add("fade-in");
    });

    card.addEventListener("mouseleave", function () {
      card.classList.add("fade-in");
      card.classList.add("fade-out");
    });
  });
};
