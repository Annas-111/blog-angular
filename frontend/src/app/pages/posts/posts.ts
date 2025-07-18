import { Component, OnInit } from '@angular/core';
import { PostsService, Post } from './posts.service';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, ValueGetterParams } from 'ag-grid-community';
import { PaginatedPostResponse } from '../../types/types';
import { Router } from '@angular/router';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);



@Component({
    selector: 'app-posts',
    imports: [CommonModule, AgGridModule],
    template: `
    <div class="p-6 space-y-6">
  <h1 class="text-3xl font-bold text-gray-800">📚 Blog Feed</h1>

  <div *ngIf="loading" class="text-gray-500 animate-pulse">Loading posts...</div>
  <div *ngIf="error" class="text-red-500 font-semibold">{{ error }}</div>

  <div class="bg-white shadow rounded-lg p-4">
    <ag-grid-angular
  class="ag-theme-alpine h-[500px] w-full"
  [rowData]="posts"
  [columnDefs]="columnDefs"
  [pagination]="true"
  [paginationPageSize]="5"
  (rowClicked)="onRowClicked($event)"
  [defaultColDef]="{ resizable: true }"
  [rowStyle]="{ cursor: 'pointer' }"
>
</ag-grid-angular>

  </div>
    </div>

  `,
})
export class PostsComponent implements OnInit {
    posts: any[] = [];
    loading = true;
    error: string | null = null;

    columnDefs = [

        {
            field: 'title',
            headerName: 'Title',
            sortable: true,
            filter: true,
            flex: 2,
            // tooltipValueGetter: (params: any) => `Go to /posts/${params.data.id}`
        },
        { field: 'excerpt', headerName: 'Content', sortable: false, flex: 3 },
        { field: 'authorName', headerName: 'Author', sortable: true, filter: true, flex: 1 },
        { field: 'publishedDate', headerName: 'Published Date', sortable: true, flex: 1 },
    ];

    constructor(
        private postsService: PostsService,
        private router: Router,
    ) { }

    onRowClicked(event: any) {
        const postId = event.data.id;
        this.router.navigate(['/post', postId]);
    }

    ngOnInit(): void {
        this.postsService.getAllPosts().subscribe({
            next: (response) => {
                console.log("RESPONSE:", JSON.stringify(response, null, 2))
                this.posts = response.data.map(post => ({
                    ...post,
                    excerpt: post.body.slice(0, 200) + '...',
                    authorName: post.author?.userName ?? 'Unknown',
                    publishedDate: new Date(post.publishedAt).toLocaleDateString()
                }));
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load posts';
                this.loading = false;
                console.error(err);
            }
        });
    }

}
