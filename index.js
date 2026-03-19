const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const fetch = require("node-fetch");

const app = express();

// 🌐 Alive server
app.get("/", (req, res) => {
  res.send("🤖 Bot Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// 🤖 Bot init
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ⚡ Random ping
function randomPing() {
  return Math.floor(Math.random() * 200) + 50;
}

// 🚀 START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `
╔═══════🤖═══════╗
      *LINK BYPASS BOT*
╚═══════🤖═══════╝

⚡ Fast • No Lag  
🔓 Direct Links  
🚀 Easy to Use  

👇 Choose option below
`, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "⚡ Bypass Link", callback_data: "bypass" }],
        [
          { text: "📊 Ping", callback_data: "ping" },
          { text: "❓ Help", callback_data: "help" }
        ]
      ]
    }
  });
});

// 🎮 Buttons
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "ping") {
    return bot.sendMessage(chatId, `
📊 *Bot Speed*

⚡ Ping: ${randomPing()} ms  
🚀 Status: Online  

👑 @Revenge_mode
`, { parse_mode: "Markdown" });
  }

  if (query.data === "help") {
    return bot.sendMessage(chatId, `
❓ *HOW TO USE*

1️⃣ Send any short link  
2️⃣ Wait 1-2 sec  
3️⃣ Get direct link 🔓  

⚡ Commands:
/start - Start bot  
/ping - Check speed  

👑 @Revenge_mode
`, { parse_mode: "Markdown" });
  }

  if (query.data === "bypass") {
    return bot.sendMessage(chatId, "🔗 Send your link now...");
  }
});

// ⚡ Ping command
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, `⚡ Ping: ${randomPing()} ms`);
});

// 🔥 Main message handler
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  if (!text.startsWith("http")) {
    return bot.sendMessage(chatId, "❌ Send valid link");
  }

  bot.sendMessage(chatId, "⏳ Bypassing...");

  try {
    const res = await fetch(`https://api.bypass.vip/?url=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (data.result) {
      bot.sendMessage(chatId, `
╔═══════✅═══════╗
        *BYPASS DONE*
╚═══════✅═══════╝

🔗 Original:
${text}

🔓 Direct:
${data.result}

⚡ Fast • No Ads  
👑 @Revenge_mode
`, { parse_mode: "Markdown" });
    } else {
      bot.sendMessage(chatId, "❌ Cannot bypass this link");
    }

  } catch (err) {
    bot.sendMessage(chatId, "❌ Error while bypassing");
  }
});
