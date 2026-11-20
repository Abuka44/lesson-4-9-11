// ============================================================
// Программа получает ПОГОДУ и КУРС ВАЛЮТ одновременно.
// Оба сервиса (API) отвечают в формате JSON - это текст вида {"ключ": значение},
// который легко превращается в обычный объект TypeScript.
// Запуск: node src/weather-currency.ts
// ============================================================

// ---------- 1. Описываем, как выглядит ответ сервера (типы) ----------

// Сервер погоды (open-meteo) присылает примерно такой JSON:
// { "current": { "time": "2026-11-20T15:00", "temperature_2m": 4.6, "wind_speed_10m": 2.7 }, ... }
// Мы описываем только те поля, которые нам нужны. Остальные поля в ответе просто игнорируются.
interface Weather {
  current: {
    time: string; // время замера, например "2026-11-20T15:00" (в JSON даты всегда приходят строкой)
    temperature_2m: number; // температура в градусах Цельсия
    wind_speed_10m: number; // скорость ветра в км/ч
  };
}

// Сервер курсов (open.er-api.com) присылает такой JSON:
// { "result": "success", "base_code": "USD", "time_last_update_utc": "...", "rates": { "KZT": 449.86, "EUR": 0.91, ... } }
// Важно: курсы даны относительно доллара. rates.KZT = 449.86 значит "за 1 доллар дают 449.86 тенге".
interface ExchangeRates {
  result: string; // "success", если всё хорошо
  base_code: string; // базовая валюта, у нас всегда "USD"
  time_last_update_utc: string; // когда сервер последний раз обновил курсы
  rates: {
    KZT: number; // тенге за 1 доллар
    EUR: number; // евро за 1 доллар
    RUB: number; // рубли за 1 доллар
  };
}

// ---------- 2. Общая функция для любого запроса ----------

// <T> - это "тип-заготовка". Мы говорим функции, какой тип ответа ждём:
// fetchJson<Weather>(...) вернёт Weather, fetchJson<ExchangeRates>(...) вернёт ExchangeRates.
// Так одна функция подходит для обоих сервисов, и не нужно писать код два раза.
// async значит, что функция работает с ожиданием, и результат придёт позже (Promise).
async function fetchJson<T>(url: string): Promise<T> {
  // fetch отправляет запрос по адресу, await ждёт, пока сервер ответит
  const response = await fetch(url);

  // response.ok равно true, если сервер ответил успешно (коды 200-299).
  // Если нет (например 404 или 500), останавливаем программу с понятным сообщением.
  if (!response.ok) {
    throw new Error(`Ошибка запроса ${response.status}: ${url}`);
  }

  // response.json() превращает текст JSON в объект.
  // TypeScript не знает, что внутри, поэтому мы пишем "as T": "поверь, там лежит тип T".
  // (TypeScript это не проверяет, поэтому если сервер поменяет формат, ошибка появится только при запуске)
  return (await response.json()) as T;
}

// ---------- 3. Две функции для двух сервисов ----------

// Погода в Алматы: latitude и longitude - это координаты города,
// а current=temperature_2m,wind_speed_10m просит у сервера только температуру и ветер.
function getWeather(): Promise<Weather> {
  return fetchJson<Weather>(
    "https://api.open-meteo.com/v1/forecast?latitude=43.24&longitude=76.89&current=temperature_2m,wind_speed_10m",
  );
}

// Курсы всех валют относительно доллара (USD)
function getRates(): Promise<ExchangeRates> {
  return fetchJson<ExchangeRates>("https://open.er-api.com/v6/latest/USD");
}

// Переводит время сервера из UTC во время Алматы.
// Сервер присылает строку вроде "Fri, 20 Nov 2026 00:02:32 +0000" (время по Гринвичу).
function toAlmatyTime(utcString: string): string {
  // new Date умеет читать такую строку и сам учитывает "+0000"
  const date = new Date(utcString);

  // toLocaleString показывает дату в нужном часовом поясе (Asia/Almaty = UTC+5)
  // "ru-RU" даёт привычный российский формат: день.месяц.год, часы:минуты
  return date.toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------- 4. Главная функция: собираем всё вместе ----------

async function main(): Promise<void> {
  // Promise.all запускает ОБА запроса одновременно и ждёт, пока придут оба ответа.
  // Если бы мы написали два await подряд, второй запрос стартовал бы только после первого.
  // Запись [weather, rates] - это "распаковка": первый ответ кладём в weather, второй в rates.
  const [weather, rates] = await Promise.all([getWeather(), getRates()]);

  // Курсы даны к доллару, поэтому для евро и рубля нужно посчитать самим.
  // Пример: если 1 USD = 450 KZT и 1 USD = 0.9 EUR, то 1 EUR = 450 / 0.9 = 500 KZT.
  const usdToKzt = rates.rates.KZT; // тенге за 1 доллар - уже готовое число
  const eurToKzt = rates.rates.KZT / rates.rates.EUR; // тенге за 1 евро
  const rubToKzt = rates.rates.KZT / rates.rates.RUB; // тенге за 1 рубль

  // Выводим погоду. ${...} внутри обратных кавычек подставляет значение в текст.
  console.log("--- Погода в Алматы ---");
  console.log(`Температура: ${weather.current.temperature_2m} °C`);
  console.log(`Ветер: ${weather.current.wind_speed_10m} км/ч`);

  // Выводим курсы. toFixed(2) оставляет два знака после запятой (449.86229 станет "449.86").
  console.log("--- Курс валют (в тенге) ---");
  console.log(`1 USD = ${usdToKzt.toFixed(2)} KZT`);
  console.log(`1 EUR = ${eurToKzt.toFixed(2)} KZT`);
  console.log(`1 RUB = ${rubToKzt.toFixed(2)} KZT`);
  console.log(`Курс обновлён: ${toAlmatyTime(rates.time_last_update_utc)} (время Алматы)`);
}

// Запускаем main. Если внутри что-то пошло не так (нет интернета, сервер вернул ошибку),
// .catch перехватит ошибку и покажет сообщение вместо того, чтобы программа упала.
main().catch((error: unknown) => {
  console.error("Не удалось получить данные:", error);
  // Код выхода 1 сообщает системе, что программа завершилась с ошибкой (0 значит "всё хорошо")
  process.exitCode = 1;
});
