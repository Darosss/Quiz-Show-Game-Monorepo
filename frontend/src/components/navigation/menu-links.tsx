import Link from "next/link";
import styles from "./menu-links.module.scss";
import { LogoutButton } from "@/components/auth";
import { useAuthContext } from "@/components/auth";
import { appRoutesList } from "./app-routes-list";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useRoomLobbyContext } from "../game-session/lobby/room-lobby-context";

export const MenuLinks: FC = () => {
  const { isLoggedIn } = useAuthContext();
  const {
    currentRoomApi: {
      api: { responseData: roomLobbyData },
    },
  } = useRoomLobbyContext();

  const pathname = usePathname();
  return (
    <ul className={styles.menuLinksList}>
      {appRoutesList
        .filter(({ onlyForLoggedIn }) => isLoggedIn === onlyForLoggedIn)
        .map(({ href, name }) => (
          <li
            key={href}
            className={`${pathname === href ? styles.active : ""}`}
          >
            <Link href={href}>
              <p>{name}</p>
            </Link>
          </li>
        ))}
      {isLoggedIn ? (
        <>
          {roomLobbyData.data ? (
            <li className={`${pathname === "/game" ? styles.active : ""}`}>
              <Link href="/game">
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
