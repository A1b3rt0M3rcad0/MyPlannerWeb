import api from "../../config/api";

const authAPI = {
  // Login (funciona para usuários e admins)
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response;
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response;
  },

  // Update Profile
  updateProfile: async (profileData) => {
    const response = await api.put("/users/me", {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
    });
    return response;
  },

  // Logout (limpar token local)
  logout: () => {
    localStorage.removeItem("finplanner_v2_access_token");
    localStorage.removeItem("finplanner_v2_refresh_token");
    localStorage.removeItem("finplanner_v2_user_info");
  },
};

export { authAPI };
export default authAPI;
