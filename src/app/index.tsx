import { Redirect, usePathname } from 'expo-router';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { getRouteByRole } from '@/utils/routes/routeResolver';

export default function GatekeeperLayout() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();

  // ✅ Wait for auth hydration
  if (loading) return null;

  // ✅ HARD BLOCK: not logged in → always go login
  if (!isAuthenticated) {
    if (!pathname.startsWith("/(auth)")) {
      return <Redirect href="/(auth)/login" />;
    }
    return null;
  }

  // ✅ Resolve correct route
  const target = getRouteByRole(user?.role, true) as string;

  // ✅ Allow nested routes inside correct stack
  if (!pathname.startsWith(target)) {
    return <Redirect href={target} />;
  }

  return null;
}
