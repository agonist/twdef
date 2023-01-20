import axios from "axios";
import { LandData } from "../ui/land/LandContent";
import { TowerData } from "../ui/tower/MyTowerItem";

export interface Player {
  balance: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    "x-access-token" : localStorage.getItem("JWT")
  },
});

export async function fetchLandInfo(id: number) {
  const res = await apiClient.get<LandData>("/metadata/land/" + id);
  return res.data;
}
export async function fetchTowerInfo(id: number) {
  const res = await apiClient.get<TowerData>("/metadata/tower/" + id);
  return res.data;
}

export async function fetchPlayerBalance(address: string) {
  const res = await apiClient.get<Player>("/player/balance/" + address);
  return res.data;
}

export async function fetchUser(){ 
  const res = await apiClient.get<User>("/user")
  return res.data
}

export async function auth_challenge(address: string) {
  const res = await apiClient.post<AuthChallenge>("/auth/authChallenge", {
    address: address,
  });
  return res.data;
}

export async function auth_verify(
  address: string,
  signature: string
) {
  const res = await apiClient.post<AuthVerify>("/auth/auth_verify", {
    address: address,
    signature: signature,
  });
  return res.data;
}

export interface User {
  address: string,
  balance: number
}

export interface AuthChallenge {
  message: string;
}

export interface AuthVerify {
  accessToken: string;
}
