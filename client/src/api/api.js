const app_url = "http://localhost:5000/api";

export const api = async (path, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        ...(options.headers || {})
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${app_url}${path}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "an error occurred whilst getting data");
    }

    return data;
}