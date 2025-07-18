import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedPostResponse } from '../../types/types';

export interface Post {
  id: number;
  title: string;
  body: string;
  publishedAt: string;
  author: {
    id: number;
    userName: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly BASE_URL = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getAllPosts(page: number = 1, limit: number = 5): Observable<PaginatedPostResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    const headers = new HttpHeaders({
      'x-api-key': environment.publicApiKey,
    });

    return this.http.get<PaginatedPostResponse>(this.BASE_URL, { params, headers });
  }
}
