import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService, } from './post.service';
import { PostById } from './post.service';
import { CommonModule } from '@angular/common';

@Component({

    selector: 'app-post-by-id',
    imports: [CommonModule],
    template: `
    <div class="flex justify-center items-center h-full px-4 py-10">
  <div class="max-w-3xl w-full px-6 py-10 space-y-6 bg-white rounded-2xl shadow-md">
    <!-- Loading/Error -->
    <div *ngIf="loading" class="text-gray-500 animate-pulse">Loading post...</div>
    <div *ngIf="error" class="text-red-600 font-semibold">{{ error }}</div>

    <!-- Post Content -->
    <div *ngIf="post">
      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-900 leading-tight">
        {{ post.title }}
      </h1>

      <!-- Meta Info -->
      <p class="text-sm text-gray-500 mt-2">
        By <span class="font-medium">{{ post.author.userName }}</span> —
        <span class="italic">{{ post.publishedAt | date:'MMM d, y' }}</span>
      </p>

      <!-- Divider -->
      <hr class="my-6 border-gray-200" />

      <!-- Body -->
      <div class="prose prose-lg max-w-none text-gray-800">
        {{ post.body }}
      </div>
    </div>
  </div>
</div>


  `
})
export class PostByIdComponent implements OnInit {
    post: PostById | null = null;
    loading = true;
    error: string | null = null;

    constructor(private route: ActivatedRoute, private postsService: PostsService) { }

    ngOnInit(): void {
        const postId = Number(this.route.snapshot.paramMap.get('id'));
        this.postsService.getPostById(postId).subscribe({
            next: (data: PostById) => {
                this.post = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load post';
                console.error(err);
                this.loading = false;
            }
        });
    }
}
