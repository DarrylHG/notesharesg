const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');

const API_ROUTES = {
  notes: import.meta.env.VITE_API_NOTES_PATH || '/notes',
  comments: import.meta.env.VITE_API_COMMENTS_PATH || '/comments',
  uploads: import.meta.env.VITE_API_UPLOADS_PATH || '/uploads',
  authMe: import.meta.env.VITE_API_AUTH_ME_PATH || '/auth/me',
  authLogout: import.meta.env.VITE_API_AUTH_LOGOUT_PATH || '/auth/logout',
};

const unwrapData = (payload) => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  return payload;
};

const buildUrl = (path, query = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
};

const request = async (path, options = {}, query = {}) => {
  const response = await fetch(buildUrl(path, query), {
    credentials: 'include',
    ...options,
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return unwrapData(data);
};

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const noteshareApi = {
  notes: {
    list: ({ sort = '-created_date', limit = 100 } = {}) => request(API_ROUTES.notes, {}, { sort, limit }),
    getById: (id) => request(`${API_ROUTES.notes}/${id}`),
    create: (payload) => request(API_ROUTES.notes, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
    update: (id, payload) => request(`${API_ROUTES.notes}/${id}`, {
      method: 'PATCH',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  },
  comments: {
    list: ({ noteId, sort = '-created_date', limit = 20 } = {}) => request(API_ROUTES.comments, {}, {
      note_id: noteId,
      sort,
      limit,
    }),
    create: (payload) => request(API_ROUTES.comments, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  },
  uploads: {
    file: async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      return request(API_ROUTES.uploads, {
        method: 'POST',
        body: formData,
      });
    },
  },
  auth: {
    me: () => request(API_ROUTES.authMe),
    logout: (redirectTo) => request(API_ROUTES.authLogout, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ redirectTo }),
    }),
    redirectToLogin: (redirectTo) => {
      const loginUrl = import.meta.env.VITE_LOGIN_URL;
      if (!loginUrl) {
        return;
      }
      const url = new URL(loginUrl, window.location.origin);
      if (redirectTo) {
        url.searchParams.set('redirect', redirectTo);
      }
      window.location.href = url.toString();
    },
  },
};