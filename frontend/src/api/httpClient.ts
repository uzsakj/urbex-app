const apiDomain: string = import.meta.env.VITE_API_DOMAIN || '';

export const httpClient = async (
    endpoint: string,
    method: string = 'GET',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any,
    token?: string
) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${apiDomain}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data?.message || 'Request failed');

    return data;
};
