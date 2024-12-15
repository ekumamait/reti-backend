@Controller('inspirations')
export class InspirationsController {
  constructor(private readonly inspirationsService: InspirationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mentor')
  createInspiration(@Req() req, @Body() createDto: CreateInspirationDto) {
    return this.inspirationsService.createInspiration(req.user.id, createDto);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('youth')
  likeInspiration(@Param('id') inspirationId: string) {
    return this.inspirationsService.likeInspiration(inspirationId);
  }
}
