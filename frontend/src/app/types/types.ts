export type AuthResponse = {
  access_token: string;
  user: {
    email: string;
    userName: string;
    sub: number;
  };
};

export type UserInfo = {
  email: string;
  userName: string;
  sub: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  publishedAt: string;
  author: {
    id: number;
    email: string;
    userName: string;
    // avoid including password in frontend model
  };
}

export interface PaginatedPostResponse {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
}

