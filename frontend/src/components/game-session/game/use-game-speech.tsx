import { useEffect } from "react";
import { CurrentTimerGameStage, PossibleLanguages } from "@/shared/enums";
import { useGameSessionContext } from "../game-session-context";
import {
  UseLocalStorageReturnType,
  useLocalStorage,
} from "@/hooks/use-local-storage";

export const synth: SpeechSynthesis | undefined =
  typeof window !== "undefined" ? window.speechSynthesis : undefined;

export const LOCAL_STORAGE_SPEECH_OPTIONS_KEY = "speech_options";

export type LocalStorageSpeechOptions = {
  enabled: boolean;
  voiceIndex: number;
};

export const useQuestionSpeech =
  (): UseLocalStorageReturnType<LocalStorageSpeechOptions> => {
    const {
      currentGameSessionApi: {
        api: { responseData: gameSessionData },
      },
    } = useGameSessionContext();

    const [speechOptions, setSpeechOptions] =
      useLocalStorage<LocalStorageSpeechOptions>(
        LOCAL_STORAGE_SPEECH_OPTIONS_KEY,
        { enabled: true, voiceIndex: 0 }
      );

    const stage = gameSessionData.data?.currentTimer?.stage;

    useEffect(() => {
      if (!synth || !speechOptions.enabled) return;

      const utterance = new SpeechSynthesisUtterance();

      utterance.voice = synth.getVoices().at(speechOptions.voiceIndex) || null;

      if (stage === CurrentTimerGameStage.QUESTION) {
        const question = gameSessionData.data?.currentQuestion?.question;

        const quesitonMap = question ? new Map(Object.entries(question)) : null;
        if (!quesitonMap) return;
        const questionText = quesitonMap.get(
          gameSessionData.data?.options.language || PossibleLanguages.EN
        );
        utterance.text = questionText;
      } else if (stage === CurrentTimerGameStage.ANSWER_TIME) {
        const answers = gameSessionData.data?.currentQuestion?.answers;

        if (!answers) return;
        const answersText = answers.map(
          (val) =>
            new Map(Object.entries(val.name)).get(
              gameSessionData.data?.options.language || PossibleLanguages.EN
            ) as string
        );
        utterance.text = answersText.join(", ");
      } else if (stage === CurrentTimerGameStage.QUESTION_RESULT) {
        const answers = gameSessionData.data?.currentQuestion?.answers;

        const correctAnswerText = answers?.find((val) => val.isCorrect);

        utterance.text = correctAnswerText
          ? stage +
            " - " +
            (new Map(Object.entries(correctAnswerText.name)).get(
              gameSessionData.data?.options.language || PossibleLanguages.EN
            ) as string)
          : "";
      } else if (stage) {
        utterance.text = stage;
      }

      if (synth.speaking) synth.cancel();
      synth.speak(utterance);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage, speechOptions]);

    useEffect(() => {
      if (!speechOptions.enabled) synth?.cancel();
    }, [speechOptions.enabled]);

    return [speechOptions, setSpeechOptions] as const;
  };
