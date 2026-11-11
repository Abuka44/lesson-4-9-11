type FlightStatus = "scheduled" | "delayed" | "cancelled";

interface Flight {
  code: string;
  from: string;
  to: string;
  delayMin: number;
  status: FlightStatus;
  international: boolean;
}


const flights: Flight[] = [
  { code: "KC 851", from: "NQZ", to: "ALA", delayMin: 15 , status: "delayed", international: false },
  { code: "KC 921", from: "ALA", to: "IST", delayMin: 45, status: "scheduled", international: true },
  { code: "DV 703", from: "NQZ", to: "URA", delayMin: 0, status: "cancelled", international: true },
];
