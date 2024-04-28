export type AppRouteType = {
  href: string;
  name: string;
  onlyForLoggedIn?: boolean;
  onlyForAdmin?: boolean;
  onlyForSuperAdmin?: boolean;
};

export const appRoutesList: AppRouteType[] = [
  { href: "/auth/login", name: "Login" },
  { href: "/auth/register", name: "Register" },
  { href: "/", name: "Home", onlyForLoggedIn: true },
  { href: "/admin", name: "Admin", onlyForAdmin: true, onlyForLoggedIn: true },
  //TODO: if needed later
  // { href: "/super-admin", name: "Super Admin", onlyForSuperAdmin: true },
];
