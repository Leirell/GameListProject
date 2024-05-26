export function authHeader() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    } else {
        return {};
    }
}