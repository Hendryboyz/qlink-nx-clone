import { UserRepository } from '$/modules/user/user.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserAnalysisService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly userRepository: UserRepository) {}

  countFrom(from?: Date): Promise<number> {
    return this.userRepository.countByFilter({ from });
  }
}
