
export function isLoggedInJWT() {
    return localStorage.getItem("JWT") !== null
}