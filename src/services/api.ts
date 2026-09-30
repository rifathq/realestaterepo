// Digentic Enterprise API Client

const TOKEN_KEY = 'digentic_auth_token_v1';

export function getAuthToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string, remember: boolean = true) {
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch {
    // Ignore storage errors
  }
}

export function removeAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      errorMessage = errData.error || errorMessage;
    } catch {
      // Non-JSON error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: () => request<{ user: any }>('/api/auth/me'),
    logout: () =>
      request<{ success: boolean }>('/api/auth/logout', {
        method: 'POST',
      }),
  },

  // Properties
  properties: {
    list: (params?: { category?: string; type?: string; search?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request<any[]>(`/api/properties${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/api/properties/${id}`),
    create: (data: any) =>
      request<any>('/api/properties', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/api/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/properties/${id}`, {
        method: 'DELETE',
      }),
  },

  // Agent Isolated Properties (Enforced by backend)
  agentProperties: {
    list: (params?: { agentId?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request<any[]>(`/api/agent/properties${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/api/agent/properties/${id}`),
  },

  // Users (Super Admin)
  users: {
    list: () => request<any[]>('/api/users'),
    create: (data: any) =>
      request<any>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/users/${id}`, {
        method: 'DELETE',
      }),
  },

  // Agents
  agents: {
    list: () => request<any[]>('/api/agents'),
    get: (id: string) => request<any>(`/api/agents/${id}`),
    create: (data: any) =>
      request<any>('/api/agents', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/api/agents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/agents/${id}`, {
        method: 'DELETE',
      }),
  },

  // Appointments
  appointments: {
    list: () => request<any[]>('/api/appointments'),
    get: (id: string) => request<any>(`/api/appointments/${id}`),
    create: (data: any) =>
      request<any>('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/api/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/appointments/${id}`, {
        method: 'DELETE',
      }),
  },

  // Leads
  leads: {
    list: () => request<any[]>('/api/leads'),
    get: (id: string) => request<any>(`/api/leads/${id}`),
    create: (data: any) =>
      request<any>('/api/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<any>(`/api/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/leads/${id}`, {
        method: 'DELETE',
      }),
  },

  // Content (CMS)
  content: {
    get: () => request<any>('/api/content'),
    update: (data: any) =>
      request<any>('/api/content', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Reviews
  reviews: {
    list: () => request<any[]>('/api/reviews'),
    update: (id: string, data: any) =>
      request<any>(`/api/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Categories & Locations
  categories: {
    list: () => request<any[]>('/api/categories'),
    create: (data: any) =>
      request<any>('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  locations: {
    list: () => request<any[]>('/api/locations'),
  },

  // Settings & Activity
  settings: {
    get: () => request<any>('/api/settings'),
    update: (data: any) =>
      request<any>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  activity: {
    list: () => request<any[]>('/api/activity'),
  },
  compliance: {
    get: () => request<any>('/api/compliance'),
  },

  // Stats
  stats: {
    get: () => request<any>('/api/stats'),
  },
};
