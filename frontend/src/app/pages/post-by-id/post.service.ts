import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PostById {
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
  private baseUrl = `${environment.apiUrl}/posts`;
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': environment.publicApiKey,
    });
  }

  getPostById(id: number): Observable<PostById> {
    return this.http.get<PostById>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
