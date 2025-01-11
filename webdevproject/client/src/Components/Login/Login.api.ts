export const login = (username: string, password: string): Promise<boolean> => {
    return fetch("http://localhost:3001/api/v1/Login/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                sessionStorage.setItem("username", data.username);
                sessionStorage.setItem("userRole", data.userRole);
                sessionStorage.setItem("userId", data.userId);
            }
            return data.success;
        })};