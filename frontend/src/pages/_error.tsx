import type { NextPage } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {statusCode || 'Error'}
        </h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: '#64748b' }}>
          {statusCode === 404
            ? 'The page you are looking for does not exist.'
            : 'An error occurred.'}
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(to right, #0891b2, #2563eb)',
            color: 'white',
            borderRadius: '0.75rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
