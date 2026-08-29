// FloraFarm — API services: Fertilizer recommendation
import axios from 'axios';
import type { FertilizerRequest, FertilizerResult } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function recommendFertilizer(data: FertilizerRequest): Promise<FertilizerResult> {
  const response = await axios.post<FertilizerResult>(
    `${API_BASE}/api/fertilizer/recommend`,
    data,
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    }
  );
  return response.data;
}
