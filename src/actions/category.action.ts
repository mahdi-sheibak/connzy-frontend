"use server";
import { config } from "@/config";

export const getCategoryListAction = async () => {
  const response = await fetch(`${config.apiBaseUrl}/categories?s={"name":-1}`);
  const categoryList = await response.json();

  return categoryList;
};
