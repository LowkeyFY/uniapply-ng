import apiClient from "./client";

export async function getStates() {
  const response = await apiClient.get("/api/v1/states");
  return response.data;
}

export async function getUniversity(id) {
  const response = await apiClient.get(`/api/v1/universities/${id}`);
  return response.data;
}

export async function getUniversities(params = {}) {
  const response = await apiClient.get("/api/v1/universities", { params });
  return response.data;
}

export async function getUniversityCourses(universityId) {
  const response = await apiClient.get(`/api/v1/universities/${universityId}/courses`);
  return response.data;
}

export async function getCourses() {
  const response = await apiClient.get("/api/v1/courses");
  return response.data;
}
