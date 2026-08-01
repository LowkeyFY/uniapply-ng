import apiClient from "./client";

export async function createApplication(data) {
  const response = await apiClient.post("/api/v1/applications", data);
  return response.data;
}

export async function submitApplication(applicationId) {
  const response = await apiClient.post(`/api/v1/applications/${applicationId}/submit`);
  return response.data;
}

export async function listMyApplications() {
  const response = await apiClient.get("/api/v1/applications");
  return response.data;
}
