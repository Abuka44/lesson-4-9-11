// Функция 1: стоимость поездки на такси
// цена за километр * расстояние + стоимость подачи
function taxiPrice(km: number, pricePerKm: number, startPrice: number): number {
  return km * pricePerKm + startPrice;
}

// Функция 2: перевод минут в часы
function minutesToHours(minutes: number): number {
  return minutes / 60;
}

console.log(taxiPrice(10, 120, 300)); // 1500
console.log(minutesToHours(90)); // 1.5
