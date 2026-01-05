import {
    IsString,
    IsBoolean,
    IsEnum,
    IsOptional,
  } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { PostCategoryEnum, CreatePostDto } from '@org/types'
import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';

export class CreatePostRequest implements CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsEnum(PostCategoryEnum)
  category: PostCategoryEnum;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsBoolean()
  isHighlight: boolean;
}

export class UpdatePostRequest extends PartialType(CreatePostRequest) {
  @ApiPropertyOptional({
    enum: PostCategoryEnum,
  })
  @IsEnum(PostCategoryEnum)
  @IsOptional()
  override category?: PostCategoryEnum;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isHighlight?: boolean;
}

