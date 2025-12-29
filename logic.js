import fs from "fs";

const THRESHOLD = 5;

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
const state = JSON.parse(fs.readFileSync("state.json", "utf8"));

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

// 🚨 DETECTOR DE RACHAS
const alerts = [];

if (state.even >= THRESHOLD) alerts.push(`${state.even} PARES seguidos`);
if (state.odd >= THRESHOLD) alerts.push(`${state.odd} IMPARES seguidos`);
if (state.red >= THRESHOLD) alerts.push(`${state.red} ROJOS seguidos`);
if (state.black >= THRESHOLD) alerts.push(`${state.black} NEGROS seguidos`);
if (state.low >= THRESHOLD) alerts.push(`${state.low} BAJOS (1-18) seguidos`);
if (state.high >= THRESHOLD) alerts.push(`${state.high} ALTOS (19-36) seguidos`);

console.log("🎰 Número:", number);
console.log("Estado:", state);

if (alerts.length > 0) {
  console.log("🚨 RACHAS DETECTADAS:");
  alerts.forEach(a => console.log(" -", a));
}

fs.writeFileSync("state.json", JSON.stringify(state, null, 2));
