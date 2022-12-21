import axios from "axios";
import { LandData } from "../ui/land/LandContent";
import { TowerData } from "../ui/tower/MyTowerItem";

const BASE_URL = "http://localhost:2567";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export async function fetchLandInfo(id: number) {
  const res =  await apiClient.get<LandData>("/metadata/land/" + id);
  return res.data
}
export async function fetchTowerInfo(id: number) {
  const res = await apiClient.get<TowerData>("/metadata/tower/" + id);
  return res.data;
}