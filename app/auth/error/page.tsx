import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesso Negado
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Apenas o proprietário pode acessar este aplicativo.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Tentar Novamente
          </Link>
        </div>
      </div>
    </div>
  )
}
