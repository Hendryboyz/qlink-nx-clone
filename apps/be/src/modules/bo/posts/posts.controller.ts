import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '$/modules/posts/posts.service';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { RolesGuard } from '$/modules/bo/verification/roles.guard';
import { Roles } from '$/modules/bo/verification/roles.decorator';
import { BoRole } from '@org/types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Bo Posts")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Roles(BoRole.ADMIN)
  create(@Body() createPostDto: CreatePostDto) {
    this.logger.debug(
      `Received create post request: ${JSON.stringify(createPostDto)}`
    );
    return this.postsService.create(createPostDto);
  }

  @Roles(BoRole.ADMIN, BoRole.VIEWER)
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postsService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(BoRole.ADMIN, BoRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @Roles(BoRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Roles(BoRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
