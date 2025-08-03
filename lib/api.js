// lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config)
  
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    return
  }

  return response
}

// Helper functions for common HTTP methods
export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' })
}

export async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' })
}