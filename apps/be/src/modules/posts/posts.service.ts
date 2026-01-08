import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from '@org/types';
import {  CreatePostRequest, UpdatePostRequest } from '$/modules/bo/posts/posts.dto'
import { PostRepository } from './posts.repository';
import * as cheerio from 'cheerio';
import { S3storageService } from '$/modules/upload/s3storage.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly storageService: S3storageService,
    ) {}

  async create(createPostDto: CreatePostRequest): Promise<PostEntity> {
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

  private tryPersistImage(imageUrl: string): Promise<string> {
    return this.storageService.tryPersistImage(imageUrl, 'images/');
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: PostEntity[];
    total: number;
    page: number;
    limit: number;
    highlightCount: number;
  }> {
    const { data, total } = await this.postRepository.findAll(page, limit);
    const highlightCount = await this.postRepository.countHighlightPosts();
    return {
      data,
      total,
      page,
      limit,
      highlightCount,
    };
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

  public async getHighlightPosts(): Promise<PostEntity[]> {
    return this.postRepository.getHighlightPosts();
  }

  async update(id: string, updatePostDto: UpdatePostRequest): Promise<PostEntity> {
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
