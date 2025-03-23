import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from '@org/types';
import {  CreatePostDto, UpdatePostDto } from '$/modules/bo/posts/posts.dto'
import { PostRepository } from './posts.repository';
import * as cheerio from 'cheerio';
import { S3storageService } from '$/modules/upload/s3storage.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly storageService: S3storageService,
    ) {}

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    createPostDto.coverImage = await this.tryPersistImage(createPostDto.coverImage);
    createPostDto.content = await this.persistContentImages(createPostDto.content);

    return this.postRepository.create(createPostDto);
  }

  private async persistContentImages(postContent: string) {
    const $ = cheerio.load(postContent);
    for (const img of $('img')) {
      const $img = $(img);
      const imageUrl: string | undefined = $img.attr('src');
      if (!imageUrl) continue;
      $img.attr('src', await this.tryPersistImage(imageUrl));
    }
    return $.html()
  }

  private async tryPersistImage(imageUrl: string): Promise<string> {
    const tempPrefix = 'tmp/';
    const isNewImage: boolean = imageUrl.includes(tempPrefix)
    if (!isNewImage) return imageUrl;

    const imagePrefix = 'images/';
    const [cdnHostname, objectPath] = imageUrl.split(tempPrefix);
    const destinationPath = `${imagePrefix}${objectPath}`;
    await this.storageService.moveObject(`${tempPrefix}${objectPath}`, destinationPath);

    return `${cdnHostname}${destinationPath}`;
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PostEntity[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.postRepository.findAll(page, limit);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async getActivePosts(): Promise<PostEntity[]> {
    return this.postRepository.getActiveList()
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const coverImage = updatePostDto.coverImage;
    updatePostDto.coverImage = await this.tryPersistImage(coverImage);
    updatePostDto.content = await this.persistContentImages(updatePostDto.content);

    return this.postRepository.update(id, updatePostDto);
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.postRepository.remove(id);
    if (deletedCount === 0) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  }
}
