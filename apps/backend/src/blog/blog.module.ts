import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { BlogService } from './blog.service';
import { AdminBlogController, BlogController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  controllers: [AdminBlogController, BlogController],
  providers: [BlogService],
})
export class BlogModule {}
