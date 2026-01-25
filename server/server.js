const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = process.env.TG_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

app.post("/send", async (req, res) => {
  const { name, phone, service, comment } = req.body;

  const message = `
📩 Новая заявка
👤 Имя: ${name}
📞 Телефон: ${phone}
🛠️ Услуга: ${service}
📝 Комментарий: ${comment || "—"}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
