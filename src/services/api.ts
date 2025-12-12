const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.200:8004';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: number;
  username: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  job_title?: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at?: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  role?: 'Admin' | 'User';
  status?: 'Active' | 'Inactive';
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  role?: 'Admin' | 'User';
  status?: 'Active' | 'Inactive';
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }

  async getUsers(params?: {
    skip?: number;
    limit?: number;
    search_term?: string;
    status?: 'Active' | 'Inactive';
    role?: 'Admin' | 'User';
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<User[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return this.request<User[]>(`/users${query ? `?${query}` : ''}`);
  }

  async getUserById(userId: number): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  async createUser(user: UserCreateRequest): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(userId: number, user: UserUpdateRequest): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(userId: number): Promise<void> {
    return this.request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

