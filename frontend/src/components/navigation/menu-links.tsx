import Link from "next/link";
import styles from "./menu-links.module.scss";
import { LogoutButton } from "@/components/auth";
import { useAuthContext } from "@/components/auth";
import { appRoutesList } from "./app-routes-list";
import { usePathname } from "next/navigation";
import { FC } from "react";

export const MenuLinks: FC = () => {
  const { isLoggedIn } = useAuthContext();

  const pathname = usePathname();
  return (
    <ul className={styles.menuLinksList}>
      {appRoutesList
        .filter(({ onlyForLoggedIn }) => isLoggedIn === onlyForLoggedIn)
        .map(({ href, name }) => (
          <li
            key={href}
            className={`${pathname.includes(href) ? styles.active : ""}`}
          >
            <Link href={href}>
              <p>{name}</p>
            </Link>
          </li>
        ))}
      {isLoggedIn ? (
        <li>
          <LogoutButton />
        </li>
      ) : null}
    </ul>
  );
};
