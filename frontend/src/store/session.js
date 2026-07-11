const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function getStoredTokens() {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!accessToken || !refreshToken) {
        return null;
    }
    return {
        access_token: accessToken,
        refresh_token: refreshToken,
    };
}
export function setStoredTokens(tokens) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}
export function clearStoredTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('token');
}
export function parseSessionUser(accessToken) {
    if (!accessToken) {
        return null;
    }
    try {
        const payload = accessToken.split('.')[1];
        if (!payload) {
            return null;
        }
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        const userID = Number(decoded.user_id);
        const username = typeof decoded.username === 'string' ? decoded.username : '';
        if (!Number.isFinite(userID) || !username) {
            return null;
        }
        return {
            userID,
            username,
        };
    }
    catch {
        return null;
    }
}
