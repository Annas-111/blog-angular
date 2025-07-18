import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PostsService } from './create-post.service';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputText,
    ButtonModule,
    TextareaModule
  ],
  template: `
    <main class="py-12 px-4 flex justify-center">
  <div class="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 space-y-8">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
        📝 <span>Create New Post</span>
      </h2>
      <p class="text-gray-500 mt-2">Share your thoughts with the community</p>
    </div>

    <form #postForm="ngForm" (ngSubmit)="submit(postForm)" class="space-y-6">
      <!-- Title Input -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          id="title"
          type="text"
          pInputText
          [(ngModel)]="title"
          name="title"
          required
          placeholder="Enter a catchy title..."
          class="w-full"
        />
      </div>

      <!-- Body Input -->
      <div>
        <label for="body" class="block text-sm font-medium text-gray-700 mb-1">Body</label>
        <textarea
          id="body"
          rows="10"
          pInputTextarea
          [(ngModel)]="body"
          name="body"
          required
          placeholder="Write your post here..."
          class="w-full"
        ></textarea>
      </div>

      <!-- Error or Success Message -->
      <div *ngIf="error || success">
        <p *ngIf="error" class="text-sm text-red-600 font-medium">{{ error }}</p>
        <p *ngIf="success" class="text-sm text-green-600 font-medium">✅ Post published successfully!</p>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          pButton
          type="submit"
          label="Publish"
          icon="pi pi-check"
          class="w-full md:w-auto px-6"
          [disabled]="loading"
        ></button>
      </div>
    </form>
  </div>
</main>



  `,
})
export class CreatePostComponent {
  title = '';
  body = '';
  loading = false;
  error: string | null = null;
  success = false;

  constructor(private postsService: PostsService, private router: Router) {}

  submit(postForm: NgForm) {
    this.error = null;
    this.success = false;

    if (!this.title || !this.body) {
      this.error = 'Please fill out all fields.';
      return;
    }

    this.loading = true;

    this.postsService.createPost({ title: this.title, body: this.body }).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.title = '';
        this.body = '';
        postForm.resetForm();//to reset the form
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to create post. Please try again.';
        console.error(err);
      },
    });
  }
}
