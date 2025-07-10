import { auth, signOut } from '@/auth';
import Image from 'next/image';

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Tarefas Domésticas
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {session.user.name}
                </span>
              </div>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/auth/signin' });
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl text-gray-500 mb-2">Bem-vindo!</h2>
              <p className="text-gray-400">
                Suas tarefas aparecerão aqui em breve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
