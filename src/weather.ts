interface Weather {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
  };
}

async function getWeather(): Promise<Weather> {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=43.24&longitude=76.89&current=temperature_2m,wind_speed_10m";
  const response = await fetch(url);
  const data = (await response.json()) as Weather;
  return data;
}

async function main() {
  const weather = await getWeather();
  console.log(`В Алматы сейчас ${weather.current.temperature_2m} °C`);
  console.log(`Ветер ${weather.current.wind_speed_10m} км/ч`);
}

main();
