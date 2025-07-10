'use server';

import { auth } from '@/auth';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Repetition, DayOfWeek, RepetitionUnit } from '../_types/types';

export async function createTask(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const title = formData.get('title') as string;
  const dueDateString = formData.get('dueDate') as string;
  const repetitionType = formData.get('repetitionType') as string;

  if (!title?.trim()) {
    throw new Error('Título é obrigatório');
  }

  if (!dueDateString) {
    throw new Error('Data de vencimento é obrigatória');
  }

  // Encontrar ou criar usuário
  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: session.user.name || 'Usuário',
        email: session.user.email,
        image: session.user.image,
      },
    });
  }

  // Processar dados de repetição
  let repetitionData: Repetition | null = null;

  if (repetitionType && repetitionType !== 'none') {
    switch (repetitionType) {
      case 'daily':
        const dailyInterval =
          parseInt(formData.get('dailyInterval') as string) || 1;
        repetitionData = {
          type: 'daily',
          interval: dailyInterval,
        };
        break;

      case 'weekly':
        const selectedDays = formData.getAll('weeklyDays') as string[];
        if (selectedDays.length > 0) {
          repetitionData = {
            type: 'weekly',
            days: selectedDays as DayOfWeek[],
          };
        }
        break;

      case 'monthly':
        const dayOfMonth = parseInt(formData.get('monthlyDay') as string) || 1;
        repetitionData = {
          type: 'monthly',
          dayOfMonth: dayOfMonth,
        };
        break;

      case 'custom':
        const customInterval =
          parseInt(formData.get('customInterval') as string) || 1;
        const customUnit = formData.get('customUnit') as string;
        if (customUnit) {
          repetitionData = {
            type: 'custom',
            interval: customInterval,
            unit: customUnit as RepetitionUnit,
          };
        }
        break;
    }
  }

  // Criar a tarefa
  await prisma.task.create({
    data: {
      title: title.trim(),
      dueDate: new Date(dueDateString),
      ownerId: user.id,
      repetitionType: repetitionData?.type || null,
      repetitionData: repetitionData
        ? JSON.parse(JSON.stringify(repetitionData))
        : null,
    },
  });

  revalidatePath('/');
}

export async function getTasks() {
  const session = await auth();

  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tasks: {
        orderBy: {
          dueDate: 'asc',
        },
      },
    },
  });

  return user?.tasks || [];
}

export async function toggleTaskCompletion(taskId: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const task = await prisma.task.findFirst({
    where: {
      taskId: taskId,
      ownerId: user.id,
    },
  });

  if (!task) {
    throw new Error('Tarefa não encontrada');
  }

  await prisma.task.update({
    where: {
      taskId: taskId,
    },
    data: {
      isCompleted: !task.isCompleted,
    },
  });

  revalidatePath('/');
}

export async function deleteTask(taskId: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  await prisma.task.delete({
    where: {
      taskId: taskId,
      ownerId: user.id,
    },
  });

  revalidatePath('/');
}
