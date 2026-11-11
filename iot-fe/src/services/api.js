
const API_URL = "http://localhost:8080";

export async function apiFetch(path, options = {}) {
    const token = sessionStorage.getItem("accessToken");

    const headers = new Headers(options.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        sessionStorage.removeItem("accessToken");
        window.location.replace("/login");
        throw new Error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn");
    }

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
