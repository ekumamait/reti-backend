@Controller('mentorship-sessions')
export class MentorshipSessionsController {
  constructor(private readonly sessionsService: MentorshipSessionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('youth')
  bookSession(@Req() req, @Body() createDto: CreateMentorshipSessionDto) {
    return this.sessionsService.bookSession(req.user.id, createDto);
  }
}
