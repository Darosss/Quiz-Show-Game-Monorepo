import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CurrentTimerGame, CurrentTimerGameStage } from 'src/shared';

export type CurrentTimerDocument = HydratedDocument<CurrentTimer>;

@Schema({ _id: false })
export class CurrentTimer implements CurrentTimerGame {
  @Prop()
  date: Date;

  @Prop({
    enum: CurrentTimerGameStage,
    default: CurrentTimerGameStage.GAME_STARTING,
  })
  stage: CurrentTimerGameStage;
}
