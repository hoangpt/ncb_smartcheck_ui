const API_URL = import.meta.env.VITE_API_URL || '';

let isAuthRedirectInProgress = false;

function clearAuthStorage() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
}

function redirectToLogin() {
  if (isAuthRedirectInProgress) return;
  if (window.location.pathname === '/login') return;

  isAuthRedirectInProgress = true;
  clearAuthStorage();
  window.location.replace('/login');
}

function getErrorDetail(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined;
  if ('detail' in body && typeof (body as Record<string, unknown>).detail === 'string') {
    return (body as Record<string, unknown>).detail as string;
  }
  return undefined;
}

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

  private handleAuthError(response: Response, endpoint: string) {
    // Per UX: any 401 from API => force back to login.
    if (response.status !== 401) return;

    // Avoid redirect loop while attempting to login.
    if (endpoint.startsWith('/auth/login')) return;

    redirectToLogin();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    this.handleAuthError(response, endpoint);

    if (!response.ok) {
      const errorBody: unknown = await response.json().catch(() => null);
      const detail = getErrorDetail(errorBody);
      throw new Error(detail || `HTTP error! status: ${response.status}`);
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

    const headers = new Headers();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const endpoint = '/api/document-batches/upload';
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    this.handleAuthError(response, endpoint);

    if (!response.ok) {
      const errorBody: unknown = await response.json().catch(() => null);
      const detail = getErrorDetail(errorBody);
      throw new Error(detail || `HTTP error! status: ${response.status}`);
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
    return this.request<DocumentBatch[]>(`/api/document-batches/${query ? `?${query}` : ''}`);
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

    const endpoint = `/api/document-batches/${batchId}/download`;
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });

    this.handleAuthError(response, endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async getDealsByBatch(batchId: number): Promise<unknown[]> {
    return this.request<unknown[]>(`/api/deals/batch/${batchId}`);
  }

  async getDealById(dealId: number): Promise<unknown> {
    return this.request<unknown>(`/api/deals/${dealId}`);
  }

  async downloadDealPdf(dealId: number): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const endpoint = `/api/deals/${dealId}/download`;
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });

    this.handleAuthError(response, endpoint);

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

    const endpoint = `/api/deals/${dealId}/download/spending-unit`;
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });

    this.handleAuthError(response, endpoint);

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

    const endpoint = `/api/deals/${dealId}/download/receiving-unit`;
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });

    this.handleAuthError(response, endpoint);

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
export type { DocumentBatch as DocumentBatchType };
