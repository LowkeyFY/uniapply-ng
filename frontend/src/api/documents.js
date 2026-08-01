import apiClient from "./client";

export async function submitWaecManual(data) {
  const response = await apiClient.post("/api/v1/documents/waec/manual", data);
  return response.data;
}

export async function submitJambManual(data) {
  const response = await apiClient.post("/api/v1/documents/jamb/manual", data);
  return response.data;
}

export async function uploadDocument(documentType, file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post(
    `/api/v1/documents/upload?document_type=${documentType}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}
