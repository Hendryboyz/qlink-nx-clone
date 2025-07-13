import { BoUserRepository } from '$/modules/bo/user/bo-user.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BoUser, CreateBoUserDto, ListBoUserDTO } from '@org/types';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BoUserService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private repository: BoUserRepository) {}

  async createUser(
    createUserDto: CreateBoUserDto
  ): Promise<Omit<BoUser, 'password'>> {
    const existingUser =
      await this.findByName(createUserDto.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.repository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findByName(username: string) {
    return this.repository.findUserByUsername(username);
  }

  public async listByPage(page: number, limit: number): Promise<ListBoUserDTO> {
    try {
      const users = await this.repository.listByPage(page, limit);


      const total = await this.repository.countBoUsers();

      return {
        data: users.map(u => _.omit(u, 'password')),
        total
      }
    } catch (e) {
      this.logger.error(e, e.stack);
      throw e;
    }
  }
}
