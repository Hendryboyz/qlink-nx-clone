import {
    IsString,
    IsBoolean,
    IsEnum,
    IsDate,
    IsOptional,
  } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PostCategoryEnum, ICreatePost } from '@org/types'

  export class CreatePostDto implements ICreatePost {
    @IsString()
    title: string;

    @IsEnum(PostCategoryEnum)
    category: PostCategoryEnum;

    @IsString()
    content: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsBoolean()
    isActive: boolean;

    @IsDate()
    publishStartDate: Date;

    @IsDate()
    publishEndDate: Date;
  }

  export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsEnum(PostCategoryEnum)
    @IsOptional()
    override category?: PostCategoryEnum;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
  }
