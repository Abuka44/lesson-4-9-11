// Telegram-бот: отвечает на команды погодой и курсом валют.
// Запуск: npm run bot (токен берётся из файла .env, в git он не попадает)
//
// Как это работает: бот каждые несколько секунд спрашивает у Telegram "есть новые сообщения?"
// (это называется long polling), для каждого сообщения получает ответ от service.ts
// и отправляет его обратно в чат.

import { answerFor } from "./service.ts";

// ---------- Токен ----------

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("Не найден TELEGRAM_BOT_TOKEN. Создайте файл .env по образцу .env.example");
    process.exit(1);
  }
  return token;
}

const TOKEN = getToken();

// ---------- Типы JSON-ответов Telegram ----------

// Telegram всегда отвечает так: { ok: true, result: ... } или { ok: false, description: "..." }
interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

// Новое событие: нам нужны только текстовые сообщения
interface Update {
  update_id: number;
  message?: {
    chat: { id: number };
    text?: string;
  };
}

// ---------- Запрос к Telegram ----------

// Вызывает метод Telegram Bot API (getMe, getUpdates, sendMessage) и возвращает result
async function telegram<T>(method: string, params: object): Promise<T> {
  const response = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = (await response.json()) as TelegramResponse<T>;

  if (!data.ok || data.result === undefined) {
    // В сообщение не кладём адрес запроса: в нём лежит токен
    throw new Error(`Telegram ${method}: ${data.description ?? response.status}`);
  }
  return data.result;
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- Обработка одного сообщения ----------

async function handleUpdate(update: Update): Promise<void> {
  const message = update.message;
  if (!message || !message.text) {
    return; // не текст (картинка, стикер и т.д.) - пропускаем
  }

  let reply: string;
  try {
    reply = await answerFor(message.text);
  } catch (error) {
    console.error("Не удалось подготовить ответ:", errorText(error));
    reply = "Не удалось получить данные, попробуйте чуть позже.";
  }

  await telegram("sendMessage", { chat_id: message.chat.id, text: reply });
}

// ---------- Главный цикл ----------

async function main(): Promise<void> {
  // getMe проверяет токен и возвращает имя бота
  const me = await telegram<{ username: string }>("getMe", {});
  console.log(`Бот запущен: @${me.username}. Остановить: Ctrl+C`);

  // offset говорит Telegram: "сообщения до этого номера я уже обработал"
  let offset = 0;

  while (true) {
    try {
      // timeout: 30 - Telegram держит запрос до 30 секунд, пока не появится новое сообщение
      const updates = await telegram<Update[]>("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message"],
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    } catch (error) {
      console.error("Ошибка при работе с Telegram:", errorText(error));
      await sleep(5000); // небольшая пауза и пробуем снова
    }
  }
}

main().catch((error: unknown) => {
  console.error("Бот остановлен:", errorText(error));
  process.exitCode = 1;
});
