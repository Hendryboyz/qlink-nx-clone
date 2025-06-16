import { BoUserRepository } from '$/modules/bo/user/bo-user.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ListBoUserDTO } from '@org/types';

@Injectable()
export class BoUserService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private repository: BoUserRepository) {}

  public async listByPage(page: number, limit: number): Promise<ListBoUserDTO> {
    try {
      const users = await this.repository.listByPage(page, limit);
      const total = await this.repository.countBoUsers();

      return {
        data: users,
        total
      }
    } catch (e) {
      this.logger.error(e, e.stack);
      throw e;
    }
  }
}
