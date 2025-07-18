import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './create-post.dto';
import { User } from 'src/users/user.entity';

export interface PaginatedPosts {
    data: Post[];
    total: number;
    page: number;
    lastPage: number;
}

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepo: Repository<Post>,

        @InjectRepository(User)
        private userRepo: Repository<User>, // ✅ Inject UserRepo
    ) { }

    async create(createPostDto: CreatePostDto, author: { id: number }): Promise<Post> {
        const user = await this.userRepo.findOneBy({ id: author.id });

        if (!user) throw new Error('User not found'); // ← this is the correct check

        const post = this.postRepo.create({ ...createPostDto, author: user });
        return await this.postRepo.save(post);
    }

    async findAll(page = 1, limit = 5): Promise<PaginatedPosts> {
        // const take = limit;
        // const skip = (page - 1) * limit;
        const [data, total] = await this.postRepo.findAndCount({
            order: { publishedAt: 'DESC' },
            relations: ['author'],
            // take,
            // skip
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async findByPostId(postId: number) {
        return await this.postRepo.findOne({
            where: {id: postId},
            relations: ['author'],
        });
    }

    async findPostsByUser(userId: number): Promise<Post[]> {

        return this.postRepo.find({
            where: { author: { id: userId } },
            order: { publishedAt: 'DESC' },
            relations: ['author']
        });
    }

    async createBulk(postsData: { title: string; body: string; authorId: number }[]): Promise<Post[]> {
        const posts: Post[] = [];

        for (const postData of postsData) {
            const user = await this.userRepo.findOneBy({ id: postData.authorId });
            if (!user) {
                throw new Error(`User with id ${postData.authorId} not found`);
            }

            const post = this.postRepo.create({
                title: postData.title,
                body: postData.body,
                author: user,
            });

            posts.push(post);
        }

        return this.postRepo.save(posts); // TypeORM supports saving an array
    }


}
