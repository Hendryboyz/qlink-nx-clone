import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { status } = useSession();
  const isSignedIn = status !== 'unauthenticated';

  return {
    isSignedIn,
    status,
  };
};
