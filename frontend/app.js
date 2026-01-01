// Change this later when you Dockerize (e.g., http://api:3000)
const API_BASE_URL = "http://localhost:3000";

const form = document.getElementById("loginForm");
const output = document.getElementById("output");
const meBtn = document.getElementById("meBtn");
const logoutBtn = document.getElementById("logoutBtn");

function setOutput(obj) {
  output.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function validate(email, password) {
  if (!email || !email.includes("@")) return "Please enter a valid email.";
  if (!password || password.length < 4) return "Password must be at least 4 characters.";
  return null;
}

async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Login failed");
  }
  return data;
}

async function callMe() {
  const token = getToken();
  if (!token) {
    setOutput("No token found. Please login first.");
    return;
  }

  const res = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    setOutput({ error: data?.error || "Request failed", status: res.status });
    return;
  }
  setOutput(data);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const err = validate(email, password);
  if (err) {
    setOutput(err);
    return;
  }

  try {
    const data = await login(email, password);
    setToken(data.token);
    setOutput({
      message: "Login successful",
      user: data.user,
      tokenStored: true
    });
  } catch (ex) {
    setOutput({ error: ex.message });
  }
});

meBtn.addEventListener("click", callMe);

logoutBtn.addEventListener("click", () => {
  clearToken();
  setOutput("Logged out (token cleared locally).");
});

// Show current state on load
if (getToken()) {
  setOutput("Token found in localStorage. You can call /me.");
} else {
  setOutput("No token yet. Login using admin@example.com / Admin123! (after DB init).");
}