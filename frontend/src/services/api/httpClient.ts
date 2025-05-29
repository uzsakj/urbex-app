const apiDomain: string = import.meta.env.VITE_API_DOMAIN || '';

export const httpClient = async (
    endpoint: string,
    method: string = 'GET',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any,
    token?: string
) => {
    const headers: Record<string, string> = {};
    const isFormData = body instanceof FormData;

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiDomain}${endpoint}`, {
        method,
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }


    if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    }

    if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
    }

    return data;
};
