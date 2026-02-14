const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone?: string;
  company?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    _id: string;
    email: string;
    full_name: string;
    role: string;
    phone: string | null;
    company: string | null;
    is_active: boolean;
    created_at: string;
  };
}

interface ApiError {
  detail: string;
}

export const authAPI = {
  async signup(data: SignUpData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Sign up failed");
    }

    return response.json();
  },

  async signin(data: SignInData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Sign in failed");
    }

    return response.json();
  },

  async getCurrentUser(token: string) {
    try {
      if (!token) {
        throw new Error("No token provided");
      }
      
      console.log("Fetching user with token:", token.substring(0, 20) + "...");
      
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.detail || `HTTP ${response.status}: Failed to fetch current user`);
      }

      return response.json();
    } catch (err) {
      console.error("getCurrentUser error:", err);
      throw err;
    }
  },

  // Storage helpers
  saveToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("voltguard_token", token);
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("voltguard_token");
    }
    return null;
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("voltguard_token");
    }
  },

  saveUser(user: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem("voltguard_user", JSON.stringify(user));
    }
  },

  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("voltguard_user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("voltguard_user");
    }
  },

  logout() {
    this.removeToken();
    this.removeUser();
  },
};
