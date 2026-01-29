/* =========================
   TOAST (Уведомления)
   ========================= */
function showToast(text, isError = false) {
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");
  const backdrop = document.getElementById("toastBackdrop");

  toastText.textContent = text;
  toast.style.border = isError ? "2px solid #ff5b5b" : "none";

  toast.classList.add("show");
  backdrop.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    backdrop.classList.remove("show");
  }, 2500);
}

document.getElementById("toastClose").addEventListener("click", () => {
  document.getElementById("toast").classList.remove("show");
  document.getElementById("toastBackdrop").classList.remove("show");
});

/* =========================
   BURGER MENU
   ========================= */
document.getElementById("burgerBtn").addEventListener("click", () => {
  document.getElementById("headerMenu").classList.toggle("show");
});

/* =========================
   PHONE MASK +375
   ========================= */
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", (e) => {
  const input = e.target;
  const oldValue = input.value;
  const oldCursor = input.selectionStart;

  // сохраняем только цифры
  let digits = oldValue.replace(/\D/g, "");

  // всегда начинается с 375
  if (!digits.startsWith("375")) {
    digits = "375" + digits.replace(/^375/, "");
  }

  // ограничение до 12 цифр
  digits = digits.slice(0, 12);

  // форматируем
  let formatted = "+375";
  if (digits.length > 3) formatted += " (" + digits.slice(3, 5);
  if (digits.length >= 5) formatted += ") " + digits.slice(5, 8);
  if (digits.length >= 8) formatted += "-" + digits.slice(8, 10);
  if (digits.length >= 10) formatted += "-" + digits.slice(10, 12);

  input.value = formatted;

  // восстановление курсора (примерно в той же позиции)
  // если курсор был в конце — оставляем в конце
  if (oldCursor === oldValue.length) {
    input.selectionStart = input.selectionEnd = input.value.length;
  } else {
    input.selectionStart = input.selectionEnd = oldCursor;
  }
});

/* =========================
   FORM SUBMIT
   ========================= */
document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const service = document.getElementById("service").value;
  const comment = document.getElementById("comment").value.trim();
  const btn = document.querySelector(".big-btn");

  // Очистка ошибок
  name.classList.remove("error");
  phone.classList.remove("error");
  const oldErr = document.querySelector(".error-text");
  if (oldErr) oldErr.remove();

  // Валидация имени
  if (name.value.trim().length < 2) {
    name.classList.add("error");
    showToast("Введите ваше имя (минимум 2 символа).", true);
    return;
  }

  // Валидация телефона
  const digits = phone.value.replace(/\D/g, "");
  if (digits.length !== 12 || !digits.startsWith("375")) {
    phone.classList.add("error");

    const err = document.createElement("div");
    err.className = "error-text";
    err.innerText = "Введите корректный белорусский номер +375 (пример: +375 (29) 123-45-67)";
    phone.parentNode.insertBefore(err, phone.nextSibling);

    showToast("Введите корректный номер телефона.", true);
    return;
  }

  // Отправка формы
  btn.disabled = true;
  btn.textContent = "Отправляем...";
  showToast("Отправляем заявку...");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  fetch("https://server-o35p.onrender.com/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value.trim(),
      phone: phone.value.trim(),
      service,
      comment
    }),
    signal: controller.signal
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(data => {
    if (data.ok) {
      showToast("Заявка отправлена! Мы скоро свяжемся с вами.");
      document.getElementById("orderForm").reset();
      phone.value = "";
    } else {
      showToast("Ошибка отправки. Попробуйте позже.", true);
    }
  })
  .catch(err => {
    if (err.name === "AbortError") {
      showToast("Сервер долго отвечает. Попробуйте ещё раз.", true);
    } else {
      showToast("Ошибка отправки. Попробуйте позже.", true);
    }
  })
  .finally(() => {
    clearTimeout(timeout);
    btn.disabled = false;
    btn.textContent = "Отправить заявку";
  });
});
