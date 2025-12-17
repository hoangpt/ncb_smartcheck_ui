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

export interface PageMapItem {
  range: string;
  deal_id: string;
  type: string;
  status: 'ignored' | 'valid' | 'error';
}

export interface DocumentBatch {
  id: number;
  name: string;
  uploaded_by_user_id: number;
  uploaded_by?: string;
  upload_time: string;
  total_pages: number;
  deals_detected: number;
  status: 'processed' | 'processing' | 'error';
  process_progress: number;
  page_map?: PageMapItem[];
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentBatchUpdateRequest {
  name?: string;
  total_pages?: number;
  deals_detected?: number;
  status?: 'processed' | 'processing' | 'error';
  process_progress?: number;
  page_map?: PageMapItem[];
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
    const headers: any = {
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

  async uploadDocumentBatch(file: File, name?: string): Promise<DocumentBatch> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/document-batches/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getDocumentBatches(params?: {
    skip?: number;
    limit?: number;
  }): Promise<DocumentBatch[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return this.request<DocumentBatch[]>(`/api/document-batches${query ? `?${query}` : ''}`);
  }

  async getDocumentBatchById(batchId: number): Promise<DocumentBatch> {
    return this.request<DocumentBatch>(`/api/document-batches/${batchId}`);
  }

  async updateDocumentBatch(
    batchId: number,
    update: DocumentBatchUpdateRequest
  ): Promise<DocumentBatch> {
    return this.request<DocumentBatch>(`/api/document-batches/${batchId}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async deleteDocumentBatch(batchId: number): Promise<void> {
    return this.request<void>(`/api/document-batches/${batchId}`, {
      method: 'DELETE',
    });
  }

  async downloadDocumentBatch(batchId: number): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/document-batches/${batchId}/download`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async getDealsByBatch(batchId: number): Promise<any[]> {
    return this.request<any[]>(`/api/deals/batch/${batchId}`);
  }

  async getDealById(dealId: number): Promise<any> {
    return this.request<any>(`/api/deals/${dealId}`);
  }

  async downloadDealPdf(dealId: number): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/deals/${dealId}/download`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async downloadSpendingUnitPdf(dealId: number): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/deals/${dealId}/download/spending-unit`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async downloadReceivingUnitPdf(dealId: number): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/deals/${dealId}/download/receiving-unit`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  getDealPdfUrl(dealId: number): string {
    return `${API_URL}/api/deals/${dealId}/download`;
  }

  getSpendingUnitPdfUrl(dealId: number): string {
    return `${API_URL}/api/deals/${dealId}/download/spending-unit`;
  }

  getReceivingUnitPdfUrl(dealId: number): string {
    return `${API_URL}/api/deals/${dealId}/download/receiving-unit`;
  }
}

export const apiService = new ApiService();
export type { DocumentBatch };



