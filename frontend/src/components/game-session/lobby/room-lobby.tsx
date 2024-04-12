import { FC, useMemo } from "react";
import { FetchingInfo } from "@/components/common";
import styles from "./room-lobby.module.scss";
import { useAuthContext } from "@/components/auth";
import { ParticipantRoomActions } from "./participant-room-actions";
import { OwnerRoomActions } from "./owner-room-actions";
import { OwnerUserActions } from "./owner-user-actions";
import { useRoomLobbyContext } from "./room-lobby-context";

export const RoomLobby: FC = () => {
  const {
    apiUser: {
      api: { data: userData },
    },
  } = useAuthContext();

  const {
    currentRoomApi: {
      api: {
        responseData: { data },
        isPending,
        error,
      },
    },
  } = useRoomLobbyContext();

  const isOwner = userData.sub === data?.owner._id;

  const playersList = useMemo(() => {
    if (!data) return null;

    return data.players.map((player) => {
      const roomOwnerPlayer = player._id === data.owner._id;
      return (
        <div key={player._id} className={styles.player}>
          <div>
            {player.username}
            {roomOwnerPlayer ? <span>{"  "} - owner</span> : null}
          </div>
          <div>{isOwner && !roomOwnerPlayer ? <OwnerUserActions /> : null}</div>
        </div>
      );
    });
  }, [data, isOwner]);
  if (!data || error || isPending)
    return <FetchingInfo isPending={isPending} error={error} />;

  return (
    <div className={styles.roomLobbyWrapper}>
      <h2>Room lobby {data.name}</h2>
      <div>Code: {data.code}</div>
      {isOwner ? <OwnerRoomActions /> : null}
      <div className={styles.leaveRoomButton}>
        <ParticipantRoomActions />
      </div>
      <div className={styles.lobbyPlayers}>{playersList}</div>
    </div>
  );
};
