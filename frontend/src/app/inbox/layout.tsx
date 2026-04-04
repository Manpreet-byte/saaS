import { ProtectedRoute } from '@/components/auth/protected-route';

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}