import { Category, CurrentTimerGameStage, TimeoutType } from 'src/shared';

type GameTimerDataConstructor = {
  currentStage: CurrentTimerGameStage;
  currentTimer?: TimeoutType | null;
};

export class GameTimerData {
  private currentTimer: TimeoutType | null;
  private possibleCategories: Category[];
  constructor({ currentTimer }: GameTimerDataConstructor) {
    this.currentTimer = currentTimer || null;
    this.possibleCategories = [];
  }

  public setCurrentTimer(timer: TimeoutType): void {
    this.currentTimer = timer;
  }

  public setPossibleCategories(categories: Category[]): void {
    this.possibleCategories = categories;
  }
  public getPossibleCategories(): Category[] {
    return this.possibleCategories;
  }

  public stopTimer(): void {
    clearTimeout(this.currentTimer);
    this.currentTimer = null;
  }
}
