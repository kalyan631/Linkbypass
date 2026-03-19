const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const fetch = require("node-fetch");

const app = express();

// 🌐 Server
app.get("/", (req, res) => {
  res.send("🤖 Bot Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));

// 🤖 Bot init (SAFE)
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN missing");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ⚡ Ping
function randomPing() {
  return Math.floor(Math.random() * 200) + 50;
}

// START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🤖 Bot Ready!\nSend link to bypass 🔓");
});

// PING
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, `⚡ Ping: ${randomPing()} ms`);
});

// MAIN
bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    if (!text.startsWith("http")) {
      return bot.sendMessage(chatId, "❌ Send valid link");
    }

    await bot.sendMessage(chatId, "⏳ Processing...");

    let result = null;

    try {
      const res = await fetch(`https://api.bypass.vip/?url=${encodeURIComponent(text)}`);
      const data = await res.json();
      if (data.result) result = data.result;
    } catch {}

    if (result) {
      bot.sendMessage(chatId, `✅ Bypassed:\n${result}`);
    } else {
      bot.sendMessage(chatId, "❌ Failed to bypass");
    }

  } catch (err) {
    console.error("Error:", err);
  }
});
