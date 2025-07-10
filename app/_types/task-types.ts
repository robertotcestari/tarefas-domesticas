// Define os tipos de unidades para repetições customizadas
export type RepetitionUnit = 'days' | 'weeks' | 'months' | 'years';

// Define os dias da semana para repetições semanais
export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// Interface base para todas as repetições
interface BaseRepetition {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
}

// Repetição diária
interface DailyRepetition extends BaseRepetition {
  type: 'daily';
  interval: number; // Ex: 1 para todo dia, 2 para a cada 2 dias
}

// Repetição semanal
interface WeeklyRepetition extends BaseRepetition {
  type: 'weekly';
  days: DayOfWeek[]; // Ex: ["monday", "friday"]
}

// Repetição mensal
interface MonthlyRepetition extends BaseRepetition {
  type: 'monthly';
  dayOfMonth: number; // Ex: 15 para todo dia 15 do mês
}

// Repetição customizada
interface CustomRepetition extends BaseRepetition {
  type: 'custom';
  interval: number;
  unit: RepetitionUnit; // Ex: a cada 3 "months"
}

// Union Type para abranger todos os tipos de repetição
export type Repetition =
  | DailyRepetition
  | WeeklyRepetition
  | MonthlyRepetition
  | CustomRepetition;

// Interface principal para a Tarefa (Task)
export interface Task {
  taskId: string;
  title: string;
  ownerId: string | null; // Pode não ter um "dono"
  isCompleted: boolean;
  dueDate: string; // Formato ISO 8601: "YYYY-MM-DD"
  repetition: Repetition | null; // Tarefa pode não se repetir
}
