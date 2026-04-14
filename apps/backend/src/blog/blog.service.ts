import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost, BlogPostStatus } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
  ) {}

  // ── Admin ────────────────────────────────────────────────────────────────

  async adminList(status?: BlogPostStatus, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const qb = this.blogPostRepository
      .createQueryBuilder('b')
      .orderBy('b.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (status) {
      qb.where('b.status = :status', { status });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async adminGet(id: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('BLOG_POST_NOT_FOUND');
    return post;
  }

  async create(dto: CreateBlogPostDto): Promise<BlogPost> {
    const existing = await this.blogPostRepository.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('SLUG_ALREADY_EXISTS');

    const post = this.blogPostRepository.create({
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt ?? null,
      content: dto.content,
      cover_image_url: dto.cover_image_url ?? null,
      author_name: dto.author_name ?? 'lalabits.art',
      status: BlogPostStatus.Draft,
    });
    return this.blogPostRepository.save(post);
  }

  async update(id: string, dto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await this.adminGet(id);

    if (dto.slug && dto.slug !== post.slug) {
      const existing = await this.blogPostRepository.findOne({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('SLUG_ALREADY_EXISTS');
    }

    Object.assign(post, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.slug !== undefined && { slug: dto.slug }),
      ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
      ...(dto.content !== undefined && { content: dto.content }),
      ...(dto.cover_image_url !== undefined && { cover_image_url: dto.cover_image_url }),
      ...(dto.author_name !== undefined && { author_name: dto.author_name }),
    });

    return this.blogPostRepository.save(post);
  }

  async publish(id: string): Promise<BlogPost> {
    const post = await this.adminGet(id);
    post.status = BlogPostStatus.Published;
    if (!post.published_at) post.published_at = new Date();
    return this.blogPostRepository.save(post);
  }

  async unpublish(id: string): Promise<BlogPost> {
    const post = await this.adminGet(id);
    post.status = BlogPostStatus.Draft;
    return this.blogPostRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.adminGet(id);
    await this.blogPostRepository.remove(post);
  }

  // ── Public ───────────────────────────────────────────────────────────────

  async publicList(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [items, total] = await this.blogPostRepository.findAndCount({
      where: { status: BlogPostStatus.Published },
      order: { published_at: 'DESC' },
      skip: offset,
      take: limit,
      select: ['id', 'title', 'slug', 'excerpt', 'cover_image_url', 'author_name', 'published_at'],
    });
    return { items, total, page, limit };
  }

  async publicGet(slug: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { slug, status: BlogPostStatus.Published },
    });
    if (!post) throw new NotFoundException('BLOG_POST_NOT_FOUND');
    return post;
  }
}
