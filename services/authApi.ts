export const loginRequest = async (email: string, password: string) => {
    const response = await fetch("http://10.4.64.19:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciales incorrectas");

    return response.json();
};

export const logoutRequest = async (accessToken: string) => {
    await fetch("http://10.4.64.19:8081/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: accessToken }),
    });
};
