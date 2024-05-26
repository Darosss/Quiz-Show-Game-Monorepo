import { FC, useState } from "react";
import { synth, useQuestionSpeech } from "./use-game-speech";
import styles from "./game-speech.module.scss";
import { Button } from "@/components/common";

export const GameSpeech: FC = () => {
  const [speechOptions, setSpeechOptions] = useQuestionSpeech();
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div
      className={`${styles.speechOptionsWrapper} 
    ${showOptions ? styles.showed : ""}`}
    >
      <div className={styles.toggleButton}>
        <Button
          defaultButtonType="info"
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? " X " : "Speech settings "}
        </Button>
      </div>

      {showOptions ? (
        <div className={styles.speechSettings}>
          <h1>Speech options</h1>
          <div>
            Current voice:
            {synth?.getVoices().at(speechOptions.voiceIndex)?.name}
          </div>
          <div className={styles.settingsOptions}>
            <div>
              Speech:
              <Button
                defaultButtonType={speechOptions.enabled ? "success" : "danger"}
                onClick={() =>
                  setSpeechOptions((prevState) => ({
                    ...prevState,
                    enabled: !speechOptions.enabled,
                  }))
                }
              >
                {speechOptions.enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
            <div>
              <select
                defaultValue={speechOptions.voiceIndex}
                onChange={(e) => {
                  const choosenVoiceIndex = Number(e.currentTarget.value);
                  setSpeechOptions((prevState) => ({
                    ...prevState,
                    voiceIndex: isNaN(choosenVoiceIndex)
                      ? 0
                      : choosenVoiceIndex,
                  }));
                }}
              >
                {synth?.getVoices().map((voice, index) => (
                  <option key={index} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
