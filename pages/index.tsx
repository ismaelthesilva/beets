export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-6">
          <img
            src="/beeTechy-logo.png"
            alt="BeeTech Logo"
            className="w-16 h-16 object-contain opacity-90"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
          Welcome to <span className="text-orange-500">BeeTechy TS</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 text-center mb-12 max-w-xl">
          A full-stack Next.js application with PostgreSQL
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
          <a
            href="/api/v1/status"
            className="group p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
              API Status
            </h2>
          </a>

          <a
            href="/api/v1/migrations"
            className="group p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
              Migrations
            </h2>
          </a>

          <a
            href="/api/v1/users"
            className="group p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
              Users API
            </h2>
          </a>
        </div>
      </main>

      <footer className="border-t border-neutral-800 py-6">
        <p className="text-center text-gray-600 text-sm">
          Built for technical interview • 2026
        </p>
      </footer>
    </div>
  );
}
