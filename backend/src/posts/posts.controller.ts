import { Controller, UseGuards, Post as HttpPost, Body, Request, Get, Param, ParseIntPipe, Query, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './create-post.dto';
import { ApiKeyGuard } from 'src/auth/api-key.guard';

@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @HttpPost()
    create(@Body() body: CreatePostDto, @Request() req) {
        return this.postService.create(body, req.user);
    }

    @UseGuards(ApiKeyGuard)
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
    ) {
        return this.postService.findAll(Number(page), Number(limit));
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.postService.findPostsByUser(userId);
    }


    @UseGuards(ApiKeyGuard)
    @Post('bulk')
    createBulk(@Body() posts: { title: string; body: string; authorId: number }[]) {
        return this.postService.createBulk(posts);
    }


    @UseGuards(ApiKeyGuard)
    @Get(':postId')
    getPostsByPostId(@Param('postId', ParseIntPipe) postId: number) {
        return this.postService.findByPostId(postId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMyPosts(@Request() req) {
        console.log('Decoded JWT user:', req.user); // Add this
        const userId = req.user.id;
        return this.postService.findPostsByUser(userId);
    }

}
