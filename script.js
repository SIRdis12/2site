// ===== Отправка формы с валидацией =====
document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const comment = document.getElementById("comment").value.trim();

    const resultEl = document.getElementById("result");

    // Валидация
    if (name.length < 2) {
        resultEl.textContent = "Введите ваше имя (минимум 2 символа).";
        resultEl.style.color = "#d32f2f";
        return;
    }

    if (!phone.match(/^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/)) {
        resultEl.textContent = "Введите телефон в формате +375 (XX) XXX-XX-XX";
        resultEl.style.color = "#d32f2f";
        return;
    }

    // Отправка на сервер Render
    fetch("https://server-o35p.onrender.com/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, service, comment })
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            resultEl.textContent = "Заявка отправлена! Мы скоро свяжемся с вами.";
            resultEl.style.color = "#2e7d32";
            this.reset();
        } else {
            resultEl.textContent = "Ошибка. Попробуйте позже.";
            resultEl.style.color = "#d32f2f";
        }
    })
    .catch(() => {
        resultEl.textContent = "Ошибка. Попробуйте позже.";
        resultEl.style.color = "#d32f2f";
    });
});

// ===== Маска телефона =====
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function() {
    let value = this.value.replace(/\D/g, "");

    if (value.length > 12) value = value.slice(0, 12);

    let formatted = "+";

    if (value.length > 0) formatted += value.slice(0, 3);     // +375
    if (value.length > 3) formatted += " (" + value.slice(3, 5) + ")";
    if (value.length > 5) formatted += " " + value.slice(5, 8);
    if (value.length > 8) formatted += "-" + value.slice(8, 10);
    if (value.length > 10) formatted += "-" + value.slice(10, 12);

    this.value = formatted;
});
