import { BoUserRepository } from '$/modules/bo/user/bo-user.repository';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BoUser, CreateBoUserDto, ListBoUserDTO } from '@org/types';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BoUserService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private repository: BoUserRepository) {}

  public async createUser(
    dto: CreateBoUserDto
  ): Promise<Omit<BoUser, 'password'>> {
    const existingUser =
      await this.findByName(dto.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await this.hashPassword(dto.password);
    dto = _.omit(dto, 'confirmPassword');
    return this.repository.createUser({
      ...dto,
      password: hashedPassword,
    });
  }

  private hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10)
  }

  public async findByName(username: string) {
    return this.repository.findByUsername(username);
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

  public async deleteUser(userId: string): Promise<number> {
    const isExisting = await this.repository.isExisting(userId);
    if (!isExisting) {
      throw new NotFoundException('bo user not found');
    }
    return this.repository.delete(userId);
  }

  async resetPassword(userId: string, password: string) {
    const isExising = await this.repository.isExisting(userId);
    if (!isExising) {
      throw new NotFoundException('bo user not found');
    }
    const hashedPassword = await this.hashPassword(password);
    return await this.repository.updatePassword(userId, hashedPassword);
  }
}
