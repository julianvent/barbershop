import React from "react";
import Establishment from "./client";
import { isAdmin } from "@/app/utils/requestBuilder";

export default async function Page({params}){
  const isAdm = await isAdmin();
  return (
    <Establishment params={params} isAdmin={isAdm} />

  )
}