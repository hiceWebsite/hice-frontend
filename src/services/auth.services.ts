/* eslint-disable @typescript-eslint/no-explicit-any */

import { authKey } from "@/constants/authkey";
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import { decodedToken } from "@/utils/jwt";

import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/utils/local-storage";

export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  //   console.log(accessToken);
  return setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (!authToken) return null;

  try {
    const decodedData: any = decodedToken(authToken);
    return {
      email: decodedData?.userEmail || null,
      role: decodedData?.role?.toLowerCase() || null,
      ...decodedData,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    return !!authToken;
  }
};

export const removeUser = () => {
  return removeFromLocalStorage(authKey);
};

export const getNewAccessToken = async () => {
  return await axiosInstance({
    url: "https://3dmodels.hice.com.au/api/v1/auth/refresh-token",
    // url: `${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/auth/refresh-token`,
    // url: "http://localhost:5000/api/v1/auth/refresh-token",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
