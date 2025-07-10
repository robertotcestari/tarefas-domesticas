'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

interface AddTaskClientProps {
  createTaskAction: (formData: FormData) => Promise<void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Criando...' : 'Criar Tarefa'}
    </button>
  );
}

export default function AddTaskClient({
  createTaskAction,
}: AddTaskClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [repetitionType, setRepetitionType] = useState('none');

  const handleSubmit = async (formData: FormData) => {
    try {
      await createTaskAction(formData);
      setIsOpen(false);
      setRepetitionType('none');
      // Reset form
      const form = document.querySelector('form') as HTMLFormElement;
      form?.reset();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao criar tarefa. Tente novamente.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Adicionar Tarefa
      </button>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Nova Tarefa</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {/* Título da tarefa */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Ex: Lavar a louça"
          />
        </div>

        {/* Data de vencimento */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Data de Vencimento *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        {/* Tipo de repetição */}
        <div>
          <label
            htmlFor="repetitionType"
            className="block text-sm font-medium text-gray-700"
          >
            Repetição
          </label>
          <select
            id="repetitionType"
            name="repetitionType"
            value={repetitionType}
            onChange={(e) => setRepetitionType(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
          >
            <option value="none">Não se repete</option>
            <option value="daily">Diariamente</option>
            <option value="weekly">Semanalmente</option>
            <option value="monthly">Mensalmente</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {/* Opções de repetição diária */}
        {repetitionType === 'daily' && (
          <div>
            <label
              htmlFor="dailyInterval"
              className="block text-sm font-medium text-gray-700"
            >
              A cada quantos dias?
            </label>
            <input
              type="number"
              id="dailyInterval"
              name="dailyInterval"
              min="1"
              defaultValue="1"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        )}

        {/* Opções de repetição semanal */}
        {repetitionType === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias da semana
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'sunday', label: 'Domingo' },
                { value: 'monday', label: 'Segunda' },
                { value: 'tuesday', label: 'Terça' },
                { value: 'wednesday', label: 'Quarta' },
                { value: 'thursday', label: 'Quinta' },
                { value: 'friday', label: 'Sexta' },
                { value: 'saturday', label: 'Sábado' },
              ].map((day) => (
                <label key={day.value} className="flex items-center">
                  <input
                    type="checkbox"
                    name="weeklyDays"
                    value={day.value}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {day.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Opções de repetição mensal */}
        {repetitionType === 'monthly' && (
          <div>
            <label
              htmlFor="monthlyDay"
              className="block text-sm font-medium text-gray-700"
            >
              Dia do mês (1-31)
            </label>
            <input
              type="number"
              id="monthlyDay"
              name="monthlyDay"
              min="1"
              max="31"
              defaultValue="1"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        )}

        {/* Opções de repetição personalizada */}
        {repetitionType === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="customInterval"
                className="block text-sm font-medium text-gray-700"
              >
                A cada
              </label>
              <input
                type="number"
                id="customInterval"
                name="customInterval"
                min="1"
                defaultValue="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
            <div>
              <label
                htmlFor="customUnit"
                className="block text-sm font-medium text-gray-700"
              >
                Período
              </label>
              <select
                id="customUnit"
                name="customUnit"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
              >
                <option value="days">Dias</option>
                <option value="weeks">Semanas</option>
                <option value="months">Meses</option>
                <option value="years">Anos</option>
              </select>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancelar
          </button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
