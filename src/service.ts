// Сервис: получает погоду и курсы валют и готовит текстовые ответы.
// Им пользуется Telegram-бот (src/bot.ts). Данные приходят от API в формате JSON.

// ---------- Типы JSON-ответов ----------

// Ответ сервера погоды (open-meteo)
export interface Weather {
  current: {
    time: string;
    temperature_2m: number; // температура, °C
    wind_speed_10m: number; // ветер, км/ч
  };
}

// Ответ сервера курсов (open.er-api.com): курсы даны относительно 1 доллара
export interface ExchangeRates {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  rates: {
    KZT: number;
    EUR: number;
    RUB: number;
  };
}

// ---------- Запросы к API ----------

// Один запрос: проверяет статус ответа и превращает JSON в нужный тип T
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка запроса ${response.status}: ${url}`);
  }
  return (await response.json()) as T;
}

export function getWeather(): Promise<Weather> {
  return fetchJson<Weather>(
    "https://api.open-meteo.com/v1/forecast?latitude=43.24&longitude=76.89&current=temperature_2m,wind_speed_10m",
  );
}

export function getRates(): Promise<ExchangeRates> {
  return fetchJson<ExchangeRates>("https://open.er-api.com/v6/latest/USD");
}

// ---------- Тексты ответов ----------

// Переводит время сервера из UTC во время Алматы (UTC+5)
function toAlmatyTime(utcString: string): string {
  return new Date(utcString).toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatWeather(weather: Weather): string {
  return [
    "Погода в Алматы:",
    `Температура: ${weather.current.temperature_2m} °C`,
    `Ветер: ${weather.current.wind_speed_10m} км/ч`,
  ].join("\n");
}

export function formatRates(rates: ExchangeRates): string {
  // Курсы даны к доллару, поэтому тенге за 1 евро или 1 рубль = KZT / EUR (или RUB)
  const usd = rates.rates.KZT;
  const eur = rates.rates.KZT / rates.rates.EUR;
  const rub = rates.rates.KZT / rates.rates.RUB;

  return [
    "Курс валют (в тенге):",
    `1 USD = ${usd.toFixed(2)} KZT`,
    `1 EUR = ${eur.toFixed(2)} KZT`,
    `1 RUB = ${rub.toFixed(2)} KZT`,
    `Курс обновлён: ${toAlmatyTime(rates.time_last_update_utc)} (время Алматы)`,
  ].join("\n");
}

const HELP_TEXT = [
  "Я показываю погоду в Алматы и курс валют.",
  "",
  "/weather - погода",
  "/rates - курс валют",
  "/all - погода и курс вместе",
  "/help - эта подсказка",
].join("\n");

// ---------- Команды бота ----------

// Принимает текст сообщения и возвращает текст ответа
export async function answerFor(text: string): Promise<string> {
  // Берём первое слово. В группах команда приходит как "/weather@имя_бота", отрезаем "@..."
  const firstWord = text.trim().split(" ")[0] ?? "";
  const command = (firstWord.split("@")[0] ?? "").toLowerCase();

  switch (command) {
    case "/start":
    case "/help":
      return HELP_TEXT;
    case "/weather":
      return formatWeather(await getWeather());
    case "/rates":
      return formatRates(await getRates());
    case "/all": {
      // Оба запроса одновременно
      const [weather, rates] = await Promise.all([getWeather(), getRates()]);
      return `${formatWeather(weather)}\n\n${formatRates(rates)}`;
    }
    default:
      return "Не знаю такой команды. Напишите /help";
  }
}
