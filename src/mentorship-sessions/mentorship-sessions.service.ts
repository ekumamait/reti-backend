@Injectable()
export class MentorshipSessionsService {
  constructor(
    @InjectRepository(MentorshipSession)
    private sessionsRepository: Repository<MentorshipSession>,
    private userService: UserService,
  ) {}

  async bookSession(youthId: string, createDto: CreateMentorshipSessionDto) {
    // Verify mentor exists
    const mentor = await this.userService.findOne(createDto.mentorId);
    const youth = await this.userService.findOne(youthId);

    if (mentor.role !== 'mentor') {
      throw new ForbiddenException('Can only book sessions with mentors');
    }

    const session = this.sessionsRepository.create({
      ...createDto,
      youth,
      youthId,
      mentor,
      mentorId: createDto.mentorId,
    });

    return this.sessionsRepository.save(session);
  }
}
