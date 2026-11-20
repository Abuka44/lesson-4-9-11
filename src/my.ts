function add(a: number, b: number): number {
  return a + b;
}
function greet(name: string, city?: string): string {
  return city ? `Привет, ${name} из города ${city}!` : `Привет, ${name}!`;
}

add(2, 3);
greet("Айгерим");
const total: number = add(1, 2);