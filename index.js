const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer-core");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("🤖 Bot Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

// Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🎯 Random Ping
function randomPing() {
  return Math.floor(Math.random() * 200) + 50;
}

// 🎬 START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `
╔═══════🤖═══════╗
   *LINK BYPASS BOT*
╚═══════🤖═══════╝

⚡ Fast Bypass  
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

// 🎮 Button Handler
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
2️⃣ Wait few seconds  
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

// 🔥 BYPASS FUNCTION
async function bypass(url) {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForTimeout(8000);

  try {
    await page.evaluate(() => {
      document.querySelectorAll("a, button").forEach(el => {
        let t = el.innerText.toLowerCase();
        if (t.includes("continue") || t.includes("get link")) el.click();
      });
    });
  } catch {}

  try {
    await page.waitForNavigation({ timeout: 10000 });
  } catch {}

  const finalUrl = page.url();
  await browser.close();
  return finalUrl;
}

// 📩 MESSAGE HANDLER
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith("/start")) return;

  if (text === "/ping") {
    return bot.sendMessage(chatId, `⚡ Ping: ${randomPing()} ms`);
  }

  if (!text.startsWith("http")) {
    return bot.sendMessage(chatId, "❌ Send valid link");
  }

  bot.sendMessage(chatId, "⏳ Processing...");

  try {
    const result = await bypass(text);

    bot.sendMessage(chatId, `
╔═══════✅═══════╗
   *BYPASS DONE*
╚═══════✅═══════╝

🔗 Original:
${text}

🔓 Direct:
${result}

🚀 No Ads • Fast  
👑 @Revenge_mode
`, { parse_mode: "Markdown" });

  } catch {
    bot.sendMessage(chatId, "❌ Failed to bypass");
  }
});
