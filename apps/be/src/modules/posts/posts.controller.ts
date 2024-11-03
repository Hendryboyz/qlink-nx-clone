import { Controller, Get, Logger, Param } from '@nestjs/common';
import { PostsService } from '$/modules/posts/posts.service';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Get()
  getActiveList() {
    return this.postsService.getActivePosts();
  }
  @Get('/detail/:id')
  getPostDetail(@Param('id') id: string) {
      return this.postsService.findOne(id);
  }
}
