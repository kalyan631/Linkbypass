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

// 🤖 Bot
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

⚡ Fast • Stable  
🔓 Multi Bypass  
🚀 Easy to Use  

👇 Choose option
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

// 🎮 BUTTONS
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
2️⃣ Wait 1-3 sec  
3️⃣ Get direct link 🔓  

⚡ Commands:
/start  
/ping  

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

// 🔥 MAIN HANDLER
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  if (!text.startsWith("http")) {
    return bot.sendMessage(chatId, "❌ Send valid link");
  }

  bot.sendMessage(chatId, "⏳ Bypassing...");

  try {
    let result = null;

    // API 1
    try {
      const res1 = await fetch(`https://api.bypass.vip/?url=${encodeURIComponent(text)}`);
      const data1 = await res1.json();
      if (data1.result) result = data1.result;
    } catch {}

    // API 2
    if (!result) {
      try {
        const res2 = await fetch(`https://bypass.pm/bypass?url=${encodeURIComponent(text)}`);
        const data2 = await res2.json();
        if (data2.destination) result = data2.destination;
      } catch {}
    }

    // API 3
    if (!result) {
      try {
        const res3 = await fetch(`https://api.linkvertise.com/api/v1/redirect/link/static/${encodeURIComponent(text)}`);
        const data3 = await res3.json();
        if (data3.data?.link?.target) result = data3.data.link.target;
      } catch {}
    }

    if (result) {
      bot.sendMessage(chatId, `
╔═══════✅═══════╗
        *BYPASS DONE*
╚═══════✅═══════╝

🔗 Original:
${text}

🔓 Direct:
${result}

⚡ Multi API Success  
👑 @Revenge_mode
`, { parse_mode: "Markdown" });
    } else {
      bot.sendMessage(chatId, `
❌ *FAILED*

⚠️ Link not supported  
🔒 Site protected  

Try another link 💡
`, { parse_mode: "Markdown" });
    }

  } catch (err) {
    bot.sendMessage(chatId, "❌ Server error");
  }
});
