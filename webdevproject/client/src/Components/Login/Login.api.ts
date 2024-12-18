export const login = (username: string, password: string): Promise<boolean> => {
    return fetch("http://localhost:3000/api/v1/Login/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })};