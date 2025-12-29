import fs from "fs";

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
const state = JSON.parse(fs.readFileSync("state.json", "utf8"));

const number = data.data.result.outcome.number;
const color = data.data.result.outcome.color.toLowerCase();

// evitar procesar el mismo número dos veces
if (state.lastNumber === number) {
  console.log("Número repetido, no se procesa");
  process.exit(0);
}

// clasificaciones
const isEven = number % 2 === 0;
const isLow = number >= 1 && number <= 18;

// reset / suma rachas
state.even = isEven ? state.even + 1 : 0;
state.odd = !isEven ? state.odd + 1 : 0;

state.red = color === "red" ? state.red + 1 : 0;
state.black = color === "black" ? state.black + 1 : 0;

state.low = isLow ? state.low + 1 : 0;
state.high = !isLow ? state.high + 1 : 0;

// guardar último número
state.lastNumber = number;

// mostrar rachas actuales
console.log("🎰 Número:", number);
console.log("Rachas actuales:");
console.log(state);

// guardar estado
fs.writeFileSync("state.json", JSON.stringify(state, null, 2));
