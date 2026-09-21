import { createInterface } from "node:readline";
import { join } from "node:path";
import { findAnswer, loadFaq } from "./faq.js";

const faq = loadFaq(join(process.cwd(), "faq.txt"));
const readline = createInterface({ input: process.stdin, output: process.stdout, prompt: "> " });

console.log("FAQ-бот. Задайте вопрос или нажмите Ctrl+C для выхода.");
readline.prompt();

readline.on("line", (question) => {
  console.log(findAnswer(question, faq) ?? "не знаю");
  readline.prompt();
});
