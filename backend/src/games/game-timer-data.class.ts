import { CurrentTimerGameStage, TimeoutType } from 'src/shared';

type GameTimerDataConstructor = {
  currentStage: CurrentTimerGameStage;
  currentTimer?: TimeoutType | null;
};

export class GameTimerData {
  private currentTimer: TimeoutType | null;
  constructor({ currentTimer }: GameTimerDataConstructor) {
    this.currentTimer = currentTimer || null;
  }

  public setCurrentTimer(timer: TimeoutType): void {
    this.currentTimer = timer;
  }

  public stopTimer(): void {
    clearTimeout(this.currentTimer);
    this.currentTimer = null;
  }
}
