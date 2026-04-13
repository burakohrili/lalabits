import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlock } from './entities/user-block.entity';
import { User } from '../auth/entities/user.entity';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserBlock, User])],
  providers: [BlockService],
  controllers: [BlockController],
  exports: [BlockService, TypeOrmModule],
})
export class BlockModule {}
