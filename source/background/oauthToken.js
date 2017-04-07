let __token = null,
    __tokenType = null;

export function clearToken() {
    __token = null;
    __tokenType = null;
}

export function getToken() {
    return __token;
}

export function getTokenType() {
    return __tokenType;
}

export function setToken(token) {
    __token = token;
}

export function setTokenType(type) {
    __tokenType = type;
}

