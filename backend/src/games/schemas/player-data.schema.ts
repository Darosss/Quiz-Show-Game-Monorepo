import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PlayerDataGame } from 'src/shared';

export type PlayerDataDocument = HydratedDocument<PlayerData>;

@Schema({ _id: false })
export class PlayerData implements PlayerDataGame {
  @Prop({ default: 0 })
  score: number;

  @Prop()
  currentAnswer?: string;

  @Prop()
  canChooseCategory?: boolean;
}
