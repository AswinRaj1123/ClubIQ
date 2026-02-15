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
    try {
      const url = `${API_BASE_URL}/api/auth/signup`;
      console.log("Making signup request to:", url);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Signup response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = "Sign up failed";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Signup successful, user:", result.user.email);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error - failed to connect to backend";
      console.error("Signup fetch error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },

  async signin(data: SignInData): Promise<AuthResponse> {
    try {
      const url = `${API_BASE_URL}/api/auth/signin`;
      console.log("Making signin request to:", url);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Signin response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = "Sign in failed";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Signin successful, user:", result.user.email);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error - failed to connect to backend";
      console.error("Signin fetch error:", errorMessage, err);
      throw new Error(errorMessage);
    }
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

  async updateRole(): Promise<AuthResponse> {
    try {
      const url = `${API_BASE_URL}/api/auth/update-role`;
      const token = this.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to update role";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result: AuthResponse = await response.json();
      // Save updated token and user
      this.saveToken(result.access_token);
      this.saveUser(result.user);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Update role error:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};

// Fault Request API
interface CreateFaultRequestData {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: "low" | "medium" | "high" | "critical";
  photo_url?: string;
}

interface FaultRequestResponse {
  id: string;
  consumer_id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: string;
  photo_url?: string;
  status: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

interface FaultRequestListResponse {
  requests: FaultRequestResponse[];
  total: number;
}

interface UpdateFaultStatusData {
  status: "assigned" | "in_progress" | "resolved" | "closed";
  assigned_to?: string;
}

export const faultAPI = {
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("voltguard_token");
    }
    return null;
  },

  getAuthHeader() {
    const token = this.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  },

  async createFaultRequest(data: CreateFaultRequestData): Promise<FaultRequestResponse> {
    try {
      const url = `${API_BASE_URL}/api/consumer/fault-request/create`;
      console.log("Creating fault request at:", url);
      console.log("Request data:", JSON.stringify(data, null, 2));

      const headers = this.getAuthHeader();
      console.log("Headers:", { ...headers, Authorization: headers.Authorization.substring(0, 30) + "..." });

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      console.log("Create fault request response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = "Failed to create fault request";
        try {
          const errorData = await response.json();
          console.log("Error response data:", errorData);
          errorMessage = errorData.detail || JSON.stringify(errorData);
        } catch (parseError) {
          console.log("Could not parse error response, using status text");
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Fault request created successfully:", result);
      return result;
    } catch (err) {
      let errorMessage = "Failed to create fault request";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object") {
        errorMessage = JSON.stringify(err);
      }
      
      console.error("Create fault request error:", errorMessage);
      console.error("Full error object:", err);
      throw new Error(errorMessage);
    }
  },

  async getMyFaultRequests(statusFilter?: string): Promise<FaultRequestListResponse> {
    try {
      let url = `${API_BASE_URL}/api/consumer/fault-requests`;
      if (statusFilter) {
        url += `?status_filter=${statusFilter}`;
      }
      console.log("Fetching my fault requests:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeader(),
      });

      console.log("Get fault requests response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to fetch fault requests";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Get fault requests error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },

  async getFaultRequest(requestId: string): Promise<FaultRequestResponse> {
    try {
      const url = `${API_BASE_URL}/api/consumer/fault-request/${requestId}`;
      console.log("Fetching fault request:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeader(),
      });

      console.log("Get fault request response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to fetch fault request";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Get fault request error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },

  async cancelFaultRequest(requestId: string): Promise<{ message: string }> {
    try {
      const url = `${API_BASE_URL}/api/consumer/fault-request/${requestId}/cancel`;
      console.log("Cancelling fault request:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: this.getAuthHeader(),
      });

      console.log("Cancel fault request response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to cancel fault request";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Cancel fault request error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },

  async getAllFaultRequests(statusFilter?: string): Promise<FaultRequestListResponse> {
    try {
      let url = `${API_BASE_URL}/api/electrician/fault-requests`;
      if (statusFilter) {
        url += `?status_filter=${statusFilter}`;
      }
      console.log("Fetching all fault requests for electrician:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeader(),
      });

      console.log("Get all fault requests response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to fetch fault requests";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Get all fault requests error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },

  async getMyAssignments(statusFilter?: string): Promise<FaultRequestListResponse> {
    try {
      let url = `${API_BASE_URL}/api/electrician/my-assignments`;
      if (statusFilter) {
        url += `?status_filter=${statusFilter}`;
      }
      console.log("Fetching my assignments:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeader(),
      });

      console.log("Get my assignments response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to fetch assignments";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Get my assignments error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },

  async updateFaultStatus(requestId: string, data: UpdateFaultStatusData): Promise<{ message: string }> {
    try {
      const url = `${API_BASE_URL}/api/electrician/fault-request/${requestId}/assign`;
      console.log("Updating fault request status:", url, data);

      const response = await fetch(url, {
        method: "PUT",
        headers: this.getAuthHeader(),
        body: JSON.stringify(data),
      });

      console.log("Update status response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to update fault request status";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Update fault status error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },
};

// Chat API
interface ChatMessage {
  id: string;
  request_id: string;
  sender_id: string;
  sender_type: "consumer" | "electrician";
  content: string;
  created_at: string;
}

interface ChatMessagesResponse {
  messages: ChatMessage[];
  total: number;
}

export const chatAPI = {
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("voltguard_token");
    }
    return null;
  },

  getAuthHeader() {
    const token = this.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  },

  async sendMessage(requestId: string, content: string): Promise<ChatMessage> {
    try {
      const url = `${API_BASE_URL}/api/chat/send`;
      console.log("Sending message:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify({
          request_id: requestId,
          content: content,
        }),
      });

      console.log("Send message response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to send message";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Send message error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },

  async getMessages(requestId: string): Promise<ChatMessagesResponse> {
    try {
      const url = `${API_BASE_URL}/api/chat/request/${requestId}`;
      console.log("Fetching messages:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeader(),
      });

      console.log("Get messages response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to fetch messages";
        try {
          const error: ApiError = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error";
      console.error("Get messages error:", errorMessage, err);
      throw new Error(errorMessage);
    }
  },
};
