import {
  getTasks,
  toggleTaskCompletion,
  deleteTask,
} from '../lib/user-actions';
import type { Task } from '@prisma/client';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function getRepetitionText(task: Task): string {
  if (!task.repetitionType || !task.repetitionData) {
    return 'Não se repete';
  }

  try {
    const data =
      typeof task.repetitionData === 'string'
        ? JSON.parse(task.repetitionData)
        : task.repetitionData;

    switch (task.repetitionType) {
      case 'daily':
        return data.interval === 1
          ? 'Todo dia'
          : `A cada ${data.interval} dias`;
      case 'weekly':
        if (data.days && Array.isArray(data.days)) {
          const dayNames: { [key: string]: string } = {
            sunday: 'Dom',
            monday: 'Seg',
            tuesday: 'Ter',
            wednesday: 'Qua',
            thursday: 'Qui',
            friday: 'Sex',
            saturday: 'Sáb',
          };
          return `Toda semana: ${data.days
            .map((day: string) => dayNames[day])
            .join(', ')}`;
        }
        break;
      case 'monthly':
        return `Todo dia ${data.dayOfMonth} do mês`;
      case 'custom':
        const unitNames: { [key: string]: string } = {
          days: 'dias',
          weeks: 'semanas',
          months: 'meses',
          years: 'anos',
        };
        return `A cada ${data.interval} ${unitNames[data.unit]}`;
    }
  } catch (error) {
    console.error('Erro ao processar dados de repetição:', error);
  }

  return 'Não se repete';
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3
            className={`text-lg font-medium ${
              task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Vencimento:</span>{' '}
              {formatDate(task.dueDate)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Repetição:</span>{' '}
              {getRepetitionText(task)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              task.isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {task.isCompleted ? 'Concluída' : 'Pendente'}
          </span>

          {/* Botão para marcar como concluído/pendente */}
          <form
            action={toggleTaskCompletion.bind(null, task.taskId)}
            className="inline"
          >
            <button
              type="submit"
              className={`p-1 rounded-full transition-colors ${
                task.isCompleted
                  ? 'text-yellow-600 hover:bg-yellow-50'
                  : 'text-green-600 hover:bg-green-50'
              }`}
              title={
                task.isCompleted
                  ? 'Marcar como pendente'
                  : 'Marcar como concluída'
              }
            >
              {task.isCompleted ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </form>

          {/* Botão para excluir */}
          <form action={deleteTask.bind(null, task.taskId)} className="inline">
            <button
              type="submit"
              className="p-1 rounded-full text-red-600 hover:bg-red-50 transition-colors"
              title="Excluir tarefa"
              onClick={(e) => {
                if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
                  e.preventDefault();
                }
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default async function TasksList() {
  const tasks = await getTasks();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nenhuma tarefa
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece criando uma nova tarefa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.taskId} task={task} />
      ))}
    </div>
  );
}
