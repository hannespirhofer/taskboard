async function registerUser(user) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/register/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!res.ok) {
            throw new Error(res.error)
        }
        const data = await res.json();
        return data
    } catch (error) {
        throw new Error(error)
    }
}

async function logUserin(user) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/login/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!res.ok) {
            throw new Error('Login failed.', res.status)
        }
        const data = await res.json();
        return data
    } catch (error) {
        throw new Error('Login attempt failed. Try again.')
    }
}

async function logUserOut(e) {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
        await fetch(`http://127.0.0.1:8000/api/logout/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
        });
        localStorage.removeItem("authToken");
        window.location.href = "./index.html";
    } catch (error) {
        throw new Error('Login attempt failed. Try again.')
    }
}

async function validateToken() {
    const token = localStorage.getItem('authToken');
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/tokenvalidation/`, {
            headers: {
                'Authorization': `Token ${token}`
            },
        });
        if (res.ok === false) {
            throw new Error('You should not be here.')
        }
    } catch (error) {
        window.location.href = "./index.html";
    }
}