
const xyz: string[] = ["apple", "banana", "chery"];
// Прогноз: [ 'apple', 'banana', 'chery' ]
console.log(xyz);
xyz.push("orange");
// Прогноз: [ 'apple', 'banana', 'chery', 'orange' ] - push добавил orange в конец
console.log(xyz);
xyz.splice(2, 1, "kiwi", "peach");
// Прогноз: [ 'apple', 'banana', 'kiwi', 'peach', 'orange' ] - с индекса 2 убрали 1 элемент (chery) и вставили kiwi и peach
console.log(xyz);
// Прогноз: 5 - в массиве пять элементов
console.log(xyz.length);
xyz.splice(0, xyz.length - 1);
// Прогноз: [ 'orange' ] - удалили 4 элемента с начала, остался только последний
console.log(xyz);
xyz.push("alice", "bob");
// Прогноз: [ 'orange', 'alice', 'bob' ]
console.log(xyz);
// Прогноз: orange - shift достаёт и возвращает первый элемент
console.log(xyz.shift());
// Прогноз: [ 'alice', 'bob' ] - orange уже вынули
console.log(xyz);




let abc: number = 3.14;
// Прогноз: 3.14
console.log(abc);
let def: string = (15).toString();
// Прогноз: 15 - это строка "15", но console.log печатает без кавычек
console.log(def);
let less: boolean = abc < 2; // в чате переменная называлась xyz, переименовал, чтобы не путать с массивом выше
// Прогноз: false - 3.14 не меньше 2
console.log(less);

// ===== Часть 3: три новые операции над массивом =====
// Сейчас в xyz лежит [ 'alice', 'bob' ]
// Прогноз: true - includes проверяет, есть ли элемент в массиве
console.log(xyz.includes("bob"));
// Прогноз: 1 - indexOf возвращает номер элемента (счёт с нуля)
console.log(xyz.indexOf("bob"));
// Прогноз: [ 'alice' ] - slice(0, 1) копирует кусок массива с индекса 0 до 1, не включая 1
console.log(xyz.slice(0, 1));
// Прогноз: [ 'alice', 'bob' ] - slice ничего не изменил в самом массиве
console.log(xyz);

// ===== Часть 4: const и let (примеры) =====

// Пример 1: let у массива. Можно и менять содержимое, и класть в переменную другой массив
let fruitsLet: string[] = ["apple"];
fruitsLet.push("orange");
fruitsLet = ["kiwi"]; // let разрешает присвоить новое значение
// Прогноз: [ 'kiwi' ]
console.log(fruitsLet);

// Пример 2: const у массива. Содержимое менять можно, а саму переменную - нет
const fruitsConst: string[] = ["apple"];
fruitsConst.push("orange"); // можно: меняем то, что внутри массива
// fruitsConst = ["kiwi"]; // ОШИБКА: Cannot assign to 'fruitsConst' because it is a constant
// Прогноз: [ 'apple', 'orange' ]
console.log(fruitsConst);

// Пример 3: let заменили на const у числа. Пока значение не меняем, всё работает
const price: number = 3.14;
// price = 5; // ОШИБКА: Cannot assign to 'price' because it is a constant
// Прогноз: 3.14
console.log(price);

// Пример 4: const заменили на let у числа. Теперь значение можно менять, но тип остаётся number
let count: number = 3.14;
count = 5; // можно
// count = "five"; // ОШИБКА: Type 'string' is not assignable to type 'number'
// Прогноз: 5
console.log(count);

// Вывод: ошибка появляется только в строке с присваиванием (=) к const,
// потому что const не даёт положить в переменную новое значение.
// Замена const на let ошибок не создаёт, а замена let на const ломает код только там, где переменную меняют.
