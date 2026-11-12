// Модель данных для приложения записи клиентов в барбершоп

// Статус записи: только один из четырёх вариантов
type BookingStatus = "booked" | "completed" | "cancelled" | "no-show";

// Запись клиента на стрижку
interface Booking {
  id: number; // номер записи
  clientName: string; // имя клиента
  service: string; // услуга (стрижка, борода и т.д.)
  startTime: string; // дата и время начала, формат "2026-11-14T15:00"
  discount: number; // скидка в процентах (0 или 20)
  price: number; // итоговая цена в тенге, уже со скидкой
  status: BookingStatus; // текущий статус записи
}

// Три примера записей
const bookings: Booking[] = [
  {
    id: 1,
    clientName: "Алихан",
    service: "Мужская стрижка",
    startTime: "2026-11-13T12:00", // пятница, 12:00 - время скидки
    discount: 20, // стрижка в будни днём
    price: 4000, // 5000 минус 20%
    status: "completed",
  },
  {
    id: 2,
    clientName: "Дамир",
    service: "Стрижка + борода",
    startTime: "2026-11-14T16:30",
    discount: 0, // суббота, скидки нет
    price: 8000,
    status: "booked",
  },
  {
    id: 3,
    clientName: "Нурлан",
    service: "Оформление бороды",
    startTime: "2026-11-15T12:00",
    discount: 0, // борода и воскресенье, скидки нет
    price: 3000,
    status: "cancelled",
  },
];

// Определяет скидку: 20% на стрижку (и стрижку + борода) в будни с 10:00 до 13:00, иначе 0%
function getDiscount(service: string, startTime: string): number {
  const haircutServices = ["Мужская стрижка", "Стрижка + борода"];
  if (!haircutServices.includes(service)) {
    return 0; // на другие услуги (например, только борода) скидки нет
  }
  const date = new Date(startTime);
  const day = date.getDay(); // 0 - воскресенье, 6 - суббота
  const hour = date.getHours();
  const isWeekday = day >= 1 && day <= 5;
  const isDiscountTime = hour >= 10 && hour < 13;
  return isWeekday && isDiscountTime ? 20 : 0;
}

// Считает цену со скидкой: цена минус процент скидки
function priceWithDiscount(basePrice: number, discount: number): number {
  return basePrice - (basePrice * discount) / 100;
}

// Считает выручку: суммирует цены только завершённых записей
function totalRevenue(list: Booking[]): number {
  let sum = 0;
  for (const b of list) {
    if (b.status === "completed") {
      sum = sum + b.price;
    }
  }
  return sum;
}
