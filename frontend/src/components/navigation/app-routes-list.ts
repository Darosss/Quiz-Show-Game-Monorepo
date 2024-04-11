export type AppRouteType = {
  href: string;
  name: string;
  onlyForLoggedIn: boolean;
};

export const appRoutesList: AppRouteType[] = [
  { href: "/auth/login", name: "Login", onlyForLoggedIn: false },
  { href: "/auth/register", name: "Register", onlyForLoggedIn: false },
  { href: "/", name: "Home", onlyForLoggedIn: true },
];
