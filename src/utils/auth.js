export const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

// La función registrada acepta los datos necesarios como argumentos, 
// y envía una solicitud POST al endpoint dado.
export const register = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
};

export const authorize = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
}

// getContent acepta al token como argumento.
export const getUserInfoAuth = async (token) => {
  // Envía una solicitud GET a /users/me
  const res = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
}