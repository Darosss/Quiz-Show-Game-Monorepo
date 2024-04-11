import { FC, useEffect, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { FetchingInfo } from "@/components/common";
import styles from "./room-lobby.module.scss";
import { useAuthContext } from "@/components/auth";
import { ParticipantRoomActions } from "./participant-room-actions";
import { OwnerRoomActions } from "./owner-room-actions";
import { OwnerUserActions } from "./owner-user-actions";
import { useSocketEventsContext } from "@/socket/index";
import { toast } from "react-toastify";
import { Room, User } from "@/shared/index";
type CurrentRoomResponseType = Room<User>;

export const RoomLobby: FC = () => {
  const {
    apiUser: {
      api: { data: userData },
    },
  } = useAuthContext();
  const {
    api: {
      responseData: { data },
      isPending,
      error,
    },
  } = useFetch<CurrentRoomResponseType>({
    url: "rooms/current-room",
    method: "GET",
  });

  const {
    events: { userJoinedRoom, userLeftRoom },
  } = useSocketEventsContext();

  useEffect(() => {
    userJoinedRoom.on((user) => {
      if (!data) return;

      toast.info(`${user.username} joined the room`);
    });
    return () => {
      userJoinedRoom.off();
    };
  }, [userJoinedRoom, data]);

  useEffect(() => {
    userLeftRoom.on((userId, username) => {
      //TODO: remove it form data.
      toast.info(`${username} left the room`);
    });

    return () => {
      userLeftRoom.off();
    };
  }, [userLeftRoom]);
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
      {isOwner ? <OwnerRoomActions /> : null}
      <div className={styles.leaveRoomButton}>
        <ParticipantRoomActions />
      </div>
      <div className={styles.lobbyPlayers}>{playersList}</div>
    </div>
  );
};
