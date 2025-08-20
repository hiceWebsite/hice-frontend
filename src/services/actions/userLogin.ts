// "use server";

import { FieldValues } from "react-hook-form";
import setAccessToken from "./setAccessToken";

export const userLogin = async (data: FieldValues) => {
  const res = await fetch("https://3dmodels.hice.com.au/api/v1/auth/login", {
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/auth/login`,
    //   {
    // const res = await fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
    // cache: "no-store",
  });
  const userInfo = await res.json();

  const passwordChangeRequired = userInfo.data.needPasswordChange;

  if (userInfo.data.accessToken) {
    setAccessToken(userInfo.data.accessToken, {
      redirect: "/",
      passwordChangeRequired,
    });
  }

  return userInfo;
};
