// FloraFarm — API services: Disease prediction
import axios from 'axios';
import type { DiseaseResult } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function predictDisease(imageFile: File): Promise<DiseaseResult> {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post<DiseaseResult>(
    `${API_BASE}/api/disease/predict`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }
  );
  return response.data;
}

export async function checkHealth(): Promise<{ status: string; disease_model: boolean; fertilizer_model: boolean }> {
  const response = await axios.get(`${API_BASE}/api/health`, { timeout: 5000 });
  return response.data;
}

