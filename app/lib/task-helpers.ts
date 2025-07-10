import { Task as PrismaTask, User as PrismaUser } from '@prisma/client';
import { Task, User, DayOfWeek, RepetitionUnit } from '../_types/types';

// Tipos auxiliares para repetição
type DailyRepetitionData = {
  interval: number;
};

type WeeklyRepetitionData = {
  days: DayOfWeek[];
};

type MonthlyRepetitionData = {
  dayOfMonth: number;
};

type CustomRepetitionData = {
  interval: number;
  unit: RepetitionUnit;
};

// Converte usuário do Prisma para o tipo da aplicação
export function prismaUserToUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    image: prismaUser.image || undefined,
  };
}

// Converte tarefa do Prisma para o tipo da aplicação
export function prismaTaskToTask(prismaTask: PrismaTask): Task {
  let repetition = null;

  if (prismaTask.repetitionType && prismaTask.repetitionData) {
    const data = prismaTask.repetitionData as Record<string, unknown>;

    switch (prismaTask.repetitionType) {
      case 'daily':
        repetition = {
          type: 'daily' as const,
          interval: (data as DailyRepetitionData).interval,
        };
        break;
      case 'weekly':
        repetition = {
          type: 'weekly' as const,
          days: (data as WeeklyRepetitionData).days,
        };
        break;
      case 'monthly':
        repetition = {
          type: 'monthly' as const,
          dayOfMonth: (data as MonthlyRepetitionData).dayOfMonth,
        };
        break;
      case 'custom':
        const customData = data as CustomRepetitionData;
        repetition = {
          type: 'custom' as const,
          interval: customData.interval,
          unit: customData.unit,
        };
        break;
    }
  }

  return {
    taskId: prismaTask.taskId,
    title: prismaTask.title,
    ownerId: prismaTask.ownerId,
    isCompleted: prismaTask.isCompleted,
    dueDate: prismaTask.dueDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD
    repetition,
  };
}

// Converte tarefa da aplicação para dados do Prisma
export function taskToPrismaData(task: Omit<Task, 'taskId'>) {
  let repetitionType = null;
  let repetitionData = null;

  if (task.repetition) {
    repetitionType = task.repetition.type;

    switch (task.repetition.type) {
      case 'daily':
        repetitionData = {
          interval: task.repetition.interval,
        };
        break;
      case 'weekly':
        repetitionData = {
          days: task.repetition.days,
        };
        break;
      case 'monthly':
        repetitionData = {
          dayOfMonth: task.repetition.dayOfMonth,
        };
        break;
      case 'custom':
        repetitionData = {
          interval: task.repetition.interval,
          unit: task.repetition.unit,
        };
        break;
    }
  }

  return {
    title: task.title,
    ownerId: task.ownerId,
    isCompleted: task.isCompleted,
    dueDate: new Date(task.dueDate),
    repetitionType,
    repetitionData,
  };
}
