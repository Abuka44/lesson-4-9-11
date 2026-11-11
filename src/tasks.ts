// Weekly tasks: the function takes a day of the week and returns a task
function getTask(day: string): string {
  switch (day) {
    case "Monday":
      return "Do the TypeScript homework";
    case "Tuesday":
      return "Review the types";
    case "Wednesday":
      return "Go to the gym";
    case "Thursday":
      return "Learn 10 English words";
    case "Friday":
      return "Submit the Git homework";
    case "Saturday":
      return "Meet with friends";
    case "Sunday":
      return "Rest and get ready for the week";
    default:
      return "There is no such day";
  }
}

// Print the tasks for the whole week
function showWeek(): void {
  const days: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (const day of days) {
    console.log(`${day}: ${getTask(day)}`);
  }
}

showWeek();
