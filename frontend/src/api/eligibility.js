import apiClient from "./client";

export async function checkEligibility(data) {
  const response = await apiClient.post("/api/v1/eligibility/check", data);
  return response.data;
}

export async function checkNoJamb(data) {
  const response = await apiClient.post("/api/v1/eligibility/no-jamb", data);
  return response.data;
}
