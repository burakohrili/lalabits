import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MilestoneService } from './milestone.service';

@Controller('milestones')
@UseGuards(JwtAuthGuard)
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get('creator')
  async getCreatorMilestones(@Request() req: { user: { sub: string } }) {
    return this.milestoneService.getCreatorMilestonesForUser(req.user.sub);
  }

  @Get('fan')
  async getFanMilestones(@Request() req: { user: { sub: string } }) {
    return this.milestoneService.getFanMilestones(req.user.sub);
  }
}
