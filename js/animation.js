// Анимация появления при скролле
const observeMenuCards = () => {
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // отключаем после появления
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

    fadeElements.forEach(el => observer.observe(el));
}

// Запускаем после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    observeMenuCards();
});