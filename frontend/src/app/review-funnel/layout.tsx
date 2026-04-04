import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ReviewFunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
