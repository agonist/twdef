import axios from "axios";
import { LandData } from "../ui/land/LandContent";

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
