import apiClient from "./client";

export const getMyProfile = () => apiClient.get("/api/v1/users/me");

export const updateMyProfile = (data) => apiClient.patch("/api/v1/users/me", data);

export const uploadPassportPhoto = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/api/v1/users/me/passport-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
