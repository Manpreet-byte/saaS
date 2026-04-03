import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="mb-6 text-lg text-slate-600 dark:text-slate-300">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:translate-y-[-1px] hover:shadow-xl"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
