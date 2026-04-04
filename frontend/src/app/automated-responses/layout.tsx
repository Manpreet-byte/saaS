import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AutomatedResponsesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
