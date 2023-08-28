import useAuth from "../Hooks/useAuth";

const IsAuthenticated = () => {
  const { isLoggedIn } = useAuth();
  return !!isLoggedIn;
};

export const authorizationFunctions: Record<
  string,
  (...args: any[]) => boolean
> = {
  isAuthenticated: IsAuthenticated,
};
