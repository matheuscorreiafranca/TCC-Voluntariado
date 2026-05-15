const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || '/api/v1';

interface ApiError {
  message: string;
  status: number;
}

export class ApiException extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('voluntamais_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function extractErrorMessage(response: Response): Promise<string> {
  const fallback = `Erro ${response.status}`;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const json = await response.json().catch(() => null) as ApiError | null;
    if (json?.message) return json.message;
  }

  const text = await response.text().catch(() => '');
  return text.trim() || fallback;
}

export async function apiGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
  } catch {
    throw new ApiException('Nao foi possivel conectar com a API. Verifique se o backend esta rodando.', 0);
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiException(message, response.status);
  }

  return response.json();
}

export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    throw new ApiException('Nao foi possivel conectar com a API. Verifique se o backend esta rodando.', 0);
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiException(message, response.status);
  }

  return response.json();
}

export async function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    throw new ApiException('Nao foi possivel conectar com a API. Verifique se o backend esta rodando.', 0);
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiException(message, response.status);
  }

  return response.json();
}
