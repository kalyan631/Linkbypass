const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer");
const express = require("express");

const app = express();

// 🌐 Web server (Render wake ke liye)
app.get("/", (req, res) => {
  res.send("🤖 Bypass Bot is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// 🤖 Telegram Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🎬 START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `
╔═══════🤖═══════╗
   *WELCOME TO BYPASS BOT*
╚═══════🤖═══════╝

🔓 Send any short link  
⚡ Get direct link instantly  

🚀 Fast • Clean • Easy  
👑 @Revenge_mode
`, { parse_mode: "Markdown" });
});

// 🔥 BYPASS FUNCTION
async function bypass(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForTimeout(12000);

  try {
    await page.evaluate(() => {
      document.querySelectorAll("a, button").forEach(el => {
        let t = el.innerText.toLowerCase();
        if (t.includes("continue") || t.includes("get link")) el.click();
      });
    });
  } catch {}

  try {
    await page.waitForNavigation({ timeout: 15000 });
  } catch {}

  let finalUrl = page.url();
  await browser.close();
  return finalUrl;
}

// 📩 MESSAGE
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text;

  if (url.startsWith("/start")) return;

  if (!url.startsWith("http")) {
    return bot.sendMessage(chatId, `
❌ *Invalid Link*  
Send valid URL  
👑 @Revenge_mode
`, { parse_mode: "Markdown" });
  }

  bot.sendMessage(chatId, "⏳ Processing...");

  try {
    let result = await bypass(url);

    bot.sendMessage(chatId, `
✅ *BYPASS SUCCESSFUL*

🔗 *Original:*  
${url}

🔓 *Bypassed:*  
${result}

👑 @Revenge_mode
`, { parse_mode: "Markdown" });

  } catch {
    bot.sendMessage(chatId, `
❌ *Failed*  
Try again later  
👑 @Revenge_mode
`, { parse_mode: "Markdown" });
  }
});
