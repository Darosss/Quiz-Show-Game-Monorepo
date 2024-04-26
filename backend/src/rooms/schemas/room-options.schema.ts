import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GameOptions } from 'src/games/schemas/game-options.schema';
import { RoomOptions as RoomOptionsType } from 'src/shared';

export type RoomOptionsDocument = HydratedDocument<RoomOptions>;

@Schema({ _id: false })
export class RoomOptions implements RoomOptionsType {
  @Prop({ default: 8 })
  maxPlayers: number;

  @Prop({ type: GameOptions, default: new GameOptions() })
  gameOptions: GameOptions;
}
