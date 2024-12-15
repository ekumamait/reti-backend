@Injectable()
export class InspirationsService {
  constructor(
    @InjectRepository(Inspiration)
    private inspirationRepository: Repository<Inspiration>,
    private userService: UserService,
  ) {}

  async createInspiration(userId: string, createDto: CreateInspirationDto) {
    // Verify user is a mentor
    const user = await this.userService.findOne(userId);
    if (user.role !== 'mentor') {
      throw new ForbiddenException('Only mentors can create inspirations');
    }

    const inspiration = this.inspirationRepository.create({
      ...createDto,
      mentor: user,
      mentorId: userId,
    });

    return this.inspirationRepository.save(inspiration);
  }

  async likeInspiration(inspirationId: string) {
    const inspiration = await this.inspirationRepository.findOne({
      where: { id: inspirationId },
    });

    if (!inspiration) {
      throw new NotFoundException('Inspiration not found');
    }

    inspiration.likes += 1;
    return this.inspirationRepository.save(inspiration);
  }
}
