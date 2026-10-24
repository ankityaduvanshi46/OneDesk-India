const API_BASE = '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {})
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const config = {
    ...options,
    headers,
    credentials: 'include'
  }

  try {
    const res = await fetch(url, config)
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`)
      error.status = res.status
      error.data = data
      throw error
    }

    return data
  } catch (err) {
    throw err
  }
}

export const api = {
  auth: {
    register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    verifyOtp: (payload) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
    resendOtp: (payload) => request('/auth/resend-otp', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me'),
    updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
    forgotPassword: (payload) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
    resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) })
  },
  applications: {
    apply: (payload) => request('/applications/apply', { method: 'POST', body: JSON.stringify(payload) }),
    getMy: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/applications/my${qs ? `?${qs}` : ''}`)
    },
    getStats: () => request('/applications/stats'),
    getDetail: (id) => request(`/applications/${id}`),
    uploadFile: (formData) => request('/applications/upload-file', { method: 'POST', body: formData })
  },
  documents: {
    getMy: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/documents/my${qs ? `?${qs}` : ''}`)
    },
    upload: (formData) => request('/documents/upload', { method: 'POST', body: formData }),
    update: (id, payload) => request(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => request(`/documents/${id}`, { method: 'DELETE' }),
    verify: (verificationId) => request(`/documents/verify/${encodeURIComponent(verificationId)}`),
    download: (id) => `${API_BASE}/documents/download/${id}`,
    // Returns { success, downloadUrl, expiresInSeconds } — redirect to downloadUrl
    getDownloadUrl: (id) => request(`/documents/download/${id}`)
  },
  notifications: {
    getAll: () => request('/notifications'),
    markRead: (id) => request(`/notifications/mark-read/${id}`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/mark-all-read', { method: 'PUT' })
  },
  tickets: {
    create: (payload) => request('/tickets', { method: 'POST', body: JSON.stringify(payload) }),
    getMy: () => request('/tickets/my'),
    reply: (id, message) => request(`/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }) })
  },
  admin: {
    getOverview: () => request('/admin/overview'),
    getApplications: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/admin/applications${qs ? `?${qs}` : ''}`)
    },
    updateStatus: (id, payload) => request(`/admin/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
    issueDocument: (id, payload) => request(`/admin/applications/${id}/issue-document`, { method: 'POST', body: JSON.stringify(payload) }),
    getUsers: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/admin/users${qs ? `?${qs}` : ''}`)
    },
    updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getAuditLogs: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/admin/audit-logs${qs ? `?${qs}` : ''}`)
    },
    // Services CRUD (admin only)
    createService: (payload) => request('/services', { method: 'POST', body: JSON.stringify(payload) }),
    updateService: (serviceId, payload) => request(`/services/${serviceId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    deleteService: (serviceId) => request(`/services/${serviceId}`, { method: 'DELETE' })
  },
  // Public services catalog
  services: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/services${qs ? `?${qs}` : ''}`)
    },
    getOne: (serviceId) => request(`/services/${serviceId}`)
  },
  payments: {
    createOrder: (payload) => request('/payments/create-order', { method: 'POST', body: JSON.stringify(payload) }),
    verifySignature: (payload) => request('/payments/verify-signature', { method: 'POST', body: JSON.stringify(payload) }),
    getMy: () => request('/payments/my')
  },
  feedback: {
    submit: (payload) => request('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
    getPublic: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/feedback${qs ? `?${qs}` : ''}`)
    }
  },
  dependents: {
    getAll: () => request('/dependents'),
    getById: (id) => request(`/dependents/${id}`),
    create: (payload) => request('/dependents', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/dependents/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => request(`/dependents/${id}`, { method: 'DELETE' })
  }
}
