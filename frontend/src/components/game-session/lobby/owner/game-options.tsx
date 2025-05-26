import { PossibleLanguages } from "@/shared/enums";
import { RoomOptions } from "@/shared/types";
import { prettierCamelCaseName } from "@/utils/utils";
import { Dispatch, FC, SetStateAction } from "react";

type GameOptionsProps = {
  options: RoomOptions;
  setOptions: Dispatch<SetStateAction<RoomOptions | undefined>>;
};

export const GameOptions: FC<GameOptionsProps> = ({ options, setOptions }) => {
  return Object.entries(options.gameOptions).map(([name, value]) => (
    <div key={name}>
      <div>{prettierCamelCaseName(name)}</div>
      {typeof value === "number" ? (
        <input
          type="number"
          defaultValue={value}
          onChange={(e) => {
            setOptions((prevState) => {
              if (!prevState) return undefined;

              return {
                ...prevState,
                gameOptions: {
                  ...prevState.gameOptions,
                  [name]: e.target.valueAsNumber,
                },
              };
            });
          }}
        />
      ) : (
        <SelectLanguage
          onChange={(language) =>
            setOptions((prevState) => {
              if (!prevState) return undefined;
              return {
                ...prevState,
                gameOptions: {
                  ...prevState.gameOptions,
                  language: language,
                },
              };
            })
          }
        />
      )}
    </div>
  ));
};

type SelectLanguageProps = {
  onChange: (language: PossibleLanguages) => void;
};
const SelectLanguage: FC<SelectLanguageProps> = ({ onChange }) => {
  return (
    <select onChange={(e) => onChange(e.target.value as PossibleLanguages)}>
      {Object.values(PossibleLanguages).map((language) => (
        <option key={language} id={language}>
          {language}
        </option>
      ))}
    </select>
  );
};
