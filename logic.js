import fs from "fs";
import https from "https";

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
const state = JSON.parse(fs.readFileSync("state.json", "utf8"));
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

const THRESHOLD = config.threshold;
const enabled = config.alerts;

const webhook = process.env.DISCORD_WEBHOOK;

const number = data.data.result.outcome.number;
const color = data.data.result.outcome.color.toLowerCase();

if (state.lastNumber === number) {
  console.log("Número repetido, no se procesa");
  process.exit(0);
}

const isEven = number % 2 === 0;
const isLow = number >= 1 && number <= 18;

state.even = isEven ? state.even + 1 : 0;
state.odd = !isEven ? state.odd + 1 : 0;

state.red = color === "red" ? state.red + 1 : 0;
state.black = color === "black" ? state.black + 1 : 0;

state.low = isLow ? state.low + 1 : 0;
state.high = !isLow ? state.high + 1 : 0;

state.lastNumber = number;

// 🚨 ALERTAS
const alerts = [];

if (enabled.even && state.even >= THRESHOLD)
  alerts.push(`🟦 ${state.even} **PARES** seguidos`);

if (enabled.odd && state.odd >= THRESHOLD)
  alerts.push(`🟥 ${state.odd} **IMPARES** seguidos`);

if (enabled.red && state.red >= THRESHOLD)
  alerts.push(`🔴 ${state.red} **ROJOS** seguidos`);

if (enabled.black && state.black >= THRESHOLD)
  alerts.push(`⚫ ${state.black} **NEGROS** seguidos`);

if (enabled.low && state.low >= THRESHOLD)
  alerts.push(`⬇️ ${state.low} **BAJOS (1–18)** seguidos`);

if (enabled.high && state.high >= THRESHOLD)
  alerts.push(`⬆️ ${state.high} **ALTOS (19–36)** seguidos`);

console.log("🎰 Número:", number);
console.log("Estado:", state);

if (alerts.length > 0 && webhook) {
  const message = {
    content: `🎰 **Mega Roulette**\n\n**Número:** ${number} (${color})\n\n${alerts.join(
      "\n"
    )}`
  };

  const req = https.request(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  req.write(JSON.stringify(message));
  req.end();

  console.log("📤 Notificación enviada a Discord");
}

fs.writeFileSync("state.json", JSON.stringify(state, null, 2));
