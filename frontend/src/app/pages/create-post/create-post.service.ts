import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreatePost {
  id: number;
  title: string;
  body: string;
  publishedAt: string;
  author: {
    id: number;
    userName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly BASE_URL = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  createPost(postData: Partial<CreatePost>): Observable<CreatePost> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<CreatePost>(this.BASE_URL, postData, { headers });
  }
}
