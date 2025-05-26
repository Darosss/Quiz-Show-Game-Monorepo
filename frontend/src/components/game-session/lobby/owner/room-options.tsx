import { RoomOptions as RoomOptionsType } from "@/shared/types";
import { Dispatch, FC, SetStateAction } from "react";

type RoomOptionsProps = {
  options: RoomOptionsType;
  setOptions: Dispatch<SetStateAction<RoomOptionsType | undefined>>;
};

export const RoomOptions: FC<RoomOptionsProps> = ({ options, setOptions }) => {
  return (
    <>
      <div>Max players</div>
      <input
        type="number"
        defaultValue={options.maxPlayers}
        onChange={(e) => {
          setOptions((prevState) => {
            if (!prevState) return undefined;

            return {
              ...prevState,
              maxPlayers: e.target.valueAsNumber,
            };
          });
        }}
      />
    </>
  );
};
