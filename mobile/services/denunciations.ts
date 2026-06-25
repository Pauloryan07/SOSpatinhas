import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

let cachedFirstPage: any = null;
const CACHE_KEY = "denunciations_cache_v1";

async function persistCache(data: any) {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Silencioso
  }
}

export async function getPersistedDenunciations(): Promise<any | null> {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getCachedDenunciations() {
  return cachedFirstPage;
}

export interface Denunciation {
  id: number;
  type: string;
  description: string;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  animal_species: string;
  animal_condition: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  evidences: { id: number; photo_path: string }[];
}

export interface DenunciationFormData {
  type: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  animal_species: string;
  animal_condition: string;
}

function buildDenunciationFormData(
  data: Partial<DenunciationFormData>,
  photos: any[]
): FormData {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key as keyof DenunciationFormData];
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });
  photos.forEach((photo, index) => {
    const name = photo.uri.split("/").pop() || `photo_${index}.jpg`;
    const type = name.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append(`evidence_photos[]`, {
      uri: photo.uri,
      name,
      type,
    } as any);
  });
  return formData;
}

export async function listDenunciations(page?: number): Promise<any> {
  const params = page ? { page } : {};
  const response = await api.get("/denunciations", { params });
  if (!page || page === 1) {
    cachedFirstPage = response.data;
  }
  return response.data;
}

export async function createDenunciation(
  data: DenunciationFormData,
  photos: any[]
): Promise<Denunciation> {
  const formData = buildDenunciationFormData(data, photos);
  const response = await api.post("/denunciations", formData);
  return response.data;
}

export async function updateDenunciation(
  id: number,
  data: Partial<DenunciationFormData>,
  photos: any[]
): Promise<Denunciation> {
  const formData = buildDenunciationFormData(data, photos);
  formData.append("_method", "PUT");
  const response = await api.post(`/denunciations/${id}`, formData);
  return response.data;
}

export async function deleteDenunciation(id: number): Promise<void> {
  await api.delete(`/denunciations/${id}`);
}
