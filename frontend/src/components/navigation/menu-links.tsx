import Link from "next/link";
import styles from "./menu-links.module.scss";
import { LogoutButton } from "@/components/auth";
import { useAuthContext } from "@/components/auth";
import { appRoutesList } from "./app-routes-list";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useRoomLobbyContext } from "../game-session/lobby/room-lobby-context";
import { RolesUser } from "@/shared/enums";

interface MenuLinksProps {
  onClickLink?: () => void;
}

export const MenuLinks: FC<MenuLinksProps> = ({ onClickLink }) => {
  const {
    apiUser: {
      api: { data },
    },
    isLoggedIn,
  } = useAuthContext();
  const {
    currentRoomApi: {
      api: { responseData: roomLobbyData },
    },
  } = useRoomLobbyContext();
  const pathname = usePathname();
  return (
    <ul className={styles.menuLinksList}>
      {appRoutesList
        .filter(({ onlyForLoggedIn, onlyForAdmin, onlyForSuperAdmin }) => {
          if (onlyForLoggedIn && !isLoggedIn) return false;
          if (!onlyForLoggedIn && isLoggedIn) {
            return false;
          } else if (onlyForAdmin && !data.roles.includes(RolesUser.Admin))
            return false;
          else if (
            onlyForSuperAdmin &&
            !data.roles.includes(RolesUser.SuperAdmin)
          )
            return false;
          return true;
        })
        .map(({ href, name }) => (
          <li
            key={href}
            className={`${pathname === href ? styles.active : ""}`}
          >
            <Link href={href} onClick={onClickLink}>
              <p>{name}</p>
            </Link>
          </li>
        ))}
      {isLoggedIn ? (
        <>
          {roomLobbyData.data ? (
            <li className={`${pathname === "/game" ? styles.active : ""}`}>
              <Link href="/game" onClick={onClickLink}>
                <p>{`${roomLobbyData.data.game ? "Game" : "Lobby"}`}</p>
              </Link>
            </li>
          ) : null}

          <li>
            <LogoutButton />
          </li>
        </>
      ) : null}
    </ul>
  );
};
