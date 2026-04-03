import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AISuggestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
