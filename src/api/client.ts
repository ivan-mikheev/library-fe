import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  UserCreate,
  UserResponse,
  Token,
  BookListResponse,
  BookResponse,
  CategoryResponse,
  ReservationCreate,
  ReservationResponse,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем токен в заголовки при наличии
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Обработка ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Токен истек или невалиден
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: UserCreate): Promise<UserResponse> {
    const response = await this.client.post<UserResponse>('/users/register', userData);
    return response.data;
  }

  async login(email: string, password: string): Promise<Token> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const response = await this.client.post<Token>('/users/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await this.client.get<UserResponse>('/users/me');
    return response.data;
  }

  // Books endpoints
  async getBooks(params?: {
    category_id?: number | null;
    skip?: number;
    limit?: number;
  }): Promise<BookListResponse[]> {
    const response = await this.client.get<BookListResponse[]>('/books/', { params });
    return response.data;
  }

  async getBook(bookId: number): Promise<BookResponse> {
    const response = await this.client.get<BookResponse>(`/books/${bookId}`);
    return response.data;
  }

  async getCategories(): Promise<CategoryResponse[]> {
    const response = await this.client.get<CategoryResponse[]>('/books/categories/list');
    return response.data;
  }

  // Reservations endpoints
  async createReservation(data: ReservationCreate): Promise<ReservationResponse> {
    const response = await this.client.post<ReservationResponse>('/reservations/', data);
    return response.data;
  }

  async getMyReservations(statusFilter: string = 'active'): Promise<ReservationResponse[]> {
    const response = await this.client.get<ReservationResponse[]>('/reservations/my', {
      params: { status_filter: statusFilter },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

