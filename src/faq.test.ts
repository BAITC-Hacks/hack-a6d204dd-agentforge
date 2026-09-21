import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import { findAnswer, loadFaq } from "./faq.js";

const faq = loadFaq(join(process.cwd(), "faq.txt"));

test("loads five FAQ pairs", () => {
  assert.equal(faq.length, 5);
});

test("finds an exact known question", () => {
  assert.equal(findAnswer("Время репетиции: когда и во сколько начинается?", faq), "Репетиция начинается в 19:00 по местному времени.");
});

test("finds a paraphrased and a short topical question", () => {
  assert.equal(findAnswer("Во сколько встречаемся?", faq), "Репетиция начинается в 19:00 по местному времени.");
  assert.equal(findAnswer("команда", faq), "Команда — от 2 до 5 участников.");
  assert.equal(findAnswer("Состав команды?", faq), "Команда — от 2 до 5 участников.");
  assert.equal(findAnswer("сдача", faq), "Сдайте ссылку на репозиторий через форму организаторов до окончания репетиции.");
  assert.equal(findAnswer("Когда дедлайн?", faq), "Сдайте ссылку на репозиторий через форму организаторов до окончания репетиции.");
  assert.equal(findAnswer("Как отправить работу?", faq), "Сдайте ссылку на репозиторий через форму организаторов до окончания репетиции.");
});

test("returns no answer for an unknown question", () => {
  assert.equal(findAnswer("Какая сегодня погода?", faq), undefined);
});
