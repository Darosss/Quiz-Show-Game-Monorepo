import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { OnlyIDParamDTO, compareTwoIds } from 'src/mongo';
import { RolesAdminSuperAdminGuard } from 'src/auth';
import { UsersService } from 'src/users';
import { ControllerResponseReturn } from 'src/types';
import { randomUUID } from 'crypto';
import { ManageUserInRoom } from './enums';
import { EventsGateway } from 'src/events/events.gateway';
import { Room, User, ManagePlayerReadiness } from 'src/shared';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post('create-room')
  async create(
    @Body() { name }: Pick<CreateRoomDto, 'name'>,
    @Request() req,
  ): Promise<ControllerResponseReturn<Room>> {
    const user = await this.usersService.findOne({ _id: req.user.sub });

    try {
      return {
        data: await this.roomsService.findOne({ owner: user._id }),
        message: 'You already have a created room',
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        const createdRoom = await this.roomsService.create({
          name,
          code: randomUUID(),
          owner: user,
          players: [user],
        });

        await this.usersService.changeUserCurrentRoom(user._id, createdRoom);

        return { data: createdRoom, message: 'Room successfully created' };
      }
    }
  }

  @Get('current-room')
  async getCurrentRoom(
    @Request() req,
  ): Promise<ControllerResponseReturn<User['currentRoom']>> {
    const user = await this.usersService.findOne({ _id: req.user.sub }, {});

    return { data: user.currentRoom };
  }
  @Post('join-room/:code')
  async joinRoomByCode(
    @Request() req,
    @Param() { code }: { code: Room['code'] },
  ): Promise<ControllerResponseReturn<Room>> {
    const user = await this.usersService.findOne({ _id: req.user.sub });

    if (user.currentRoom)
      throw new BadRequestException('You already are in room');

    const foundRoom = await this.roomsService.findOne({ code });

    await this.usersService.changeUserCurrentRoom(
      user._id.toString(),
      foundRoom,
    );
    await this.roomsService.manageUserInRoom(
      String(foundRoom._id),
      String(user._id),
      ManageUserInRoom.ADD,
    );

    this.eventsGateway.server.to(code).emit('userJoinedRoom', user);

    return { data: foundRoom, message: 'Successfully joined room' };
  }

  @Post('leave-current-room')
  async leaveCurrentRoom(
    @Request() req,
  ): Promise<ControllerResponseReturn<boolean>> {
    const user = await this.usersService.findOne({ _id: req.user.sub });

    if (!user.currentRoom)
      throw new BadRequestException('You are not a member of any room');

    const foundRoom = await this.roomsService.findOne({
      _id: user.currentRoom._id,
    });

    if (
      compareTwoIds(foundRoom.owner._id, user._id) &&
      foundRoom.players.length > 1
    ) {
      await this.roomsService.changeRoomsOwner(
        foundRoom._id,
        foundRoom.players.find(
          (player) => !compareTwoIds(player._id, foundRoom.owner._id),
        )[1].data,
      );
    }
    if (foundRoom.players.length <= 1) {
      await this.roomsService.remove(foundRoom._id);
    }
    await this.roomsService.manageUserInRoom(
      foundRoom._id,
      user._id,
      ManageUserInRoom.REMOVE,
    );

    await this.usersService.removeUserCurrentRoom(user._id.toString());

    this.eventsGateway.server.to(foundRoom.code).emit('userLeftRoom', user);

    return { data: true, message: 'Successfully left the room' };
  }

  @Post('set-ready/:action')
  async setReady(
    @Request() req,
    @Param() { action }: { action: ManagePlayerReadiness },
  ): Promise<ControllerResponseReturn<string>> {
    const user = await this.usersService.findOne({ _id: req.user.sub });

    if (!user.currentRoom)
      throw new BadRequestException('You are not a member of any room');

    await this.roomsService.manageUserReadiness(
      user.currentRoom._id,
      user._id,
      action,
    );

    this.eventsGateway.server
      .to(user.currentRoom.code)
      .emit('userSetReady', user, action);

    return {
      data: user._id,
      message: `You are ${
        action === ManagePlayerReadiness.NOT_READY ? 'NOT READY' : 'READY'
      }`,
    };
  }

  @RolesAdminSuperAdminGuard()
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: OnlyIDParamDTO) {
    return this.roomsService.findOne({ _id: id });
  }

  @RolesAdminSuperAdminGuard()
  @Patch(':id')
  update(
    @Param() { id }: OnlyIDParamDTO,
    @Body() updateQuizAnswerDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateQuizAnswerDto);
  }

  @RolesAdminSuperAdminGuard()
  @Delete(':id')
  remove(@Param() { id }: OnlyIDParamDTO) {
    return this.roomsService.remove(id);
  }
}
