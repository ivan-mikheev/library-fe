// Types based on OpenAPI specification

export interface UserCreate {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone?: string | null;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  surname: string;
  phone: string | null;
  role: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string | null;
}

export interface BookListResponse {
  id: number;
  title: string;
  author: string;
  category_id: number;
  category: CategoryResponse | null;
  available_copies: number;
}

export interface BookResponse {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  category_id: number;
  category: CategoryResponse | null;
  total_copies: number;
  available_copies: number;
}

export interface ReservationCreate {
  book_id: number;
  start_date: string; // date format
  days?: number; // default: 5
}

export interface ReservationResponse {
  id: number;
  user_id: number;
  book_id: number;
  book: BookListResponse | null;
  start_date: string; // date format
  end_date: string; // date format
  created_at: string; // date-time format
  status: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

