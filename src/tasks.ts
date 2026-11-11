// Задачи на неделю: функция принимает день недели и возвращает задачу
function getTask(day: string): string {
  switch (day) {
    case "Понедельник":
      return "Сделать ДЗ по TypeScript";
    case "Вторник":
      return "Повторить типы";
    case "Среда":
      return "Сходить в спортзал";
    case "Четверг":
      return "Выучить 10 английских слов";
    case "Пятница":
      return "Сдать ДЗ по Git";
    case "Суббота":
      return "Встретиться с друзьями";
    case "Воскресенье":
      return "Отдохнуть и подготовиться к неделе";
    default:
      return "Такого дня нет";
  }
}

// Выводим задачи на всю неделю
function showWeek(): void {
  const days: string[] = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  for (const day of days) {
    console.log(`${day}: ${getTask(day)}`);
  }
}

showWeek();
