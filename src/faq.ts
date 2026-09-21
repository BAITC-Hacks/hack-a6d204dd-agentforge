import { readFileSync } from "node:fs";

export type FaqItem = {
  question: string;
  answer: string;
  keywords: string[];
};

const STOP_WORDS = new Set([
  "и", "в", "во", "на", "с", "к", "по", "для", "как", "какой", "какие",
  "кто", "что", "где", "куда", "когда", "будет", "будут", "ли", "у", "от",
  "до", "не", "мы", "наш", "нашей", "ней", "это"
]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .map((word) => word.replace(/(иями|ами|ями|ого|ему|ому|ией|иях|иям|ах|ях|ы|и|а|я|е|у|о)$/u, ""));
}

export function loadFaq(path: string): FaqItem[] {
  const blocks = readFileSync(path, "utf8").trim().split(/\r?\n\s*\r?\n/);

  return blocks.map((block) => {
    const [questionLine, answerLine] = block.split(/\r?\n/);
    if (!questionLine?.startsWith("Вопрос: ") || !answerLine?.startsWith("Ответ: ")) {
      throw new Error("Неверный формат faq.txt");
    }

    const question = questionLine.slice("Вопрос: ".length);
    return { question, answer: answerLine.slice("Ответ: ".length), keywords: words(question) };
  });
}

export function findAnswer(question: string, faq: FaqItem[]): string | undefined {
  const inputWords = new Set(words(question));
  let bestMatch: FaqItem | undefined;
  let bestScore = 0;

  for (const item of faq) {
    const score = item.keywords.filter((keyword) => inputWords.has(keyword)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch?.answer;
}
