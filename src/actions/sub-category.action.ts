"use server";
import { config } from "@/config";

export const getSubCategoryListAction = async (categoryId: string) => {
  const response = await fetch(
    `${config.apiBaseUrl}/sub-categories?q={"category":{"v":"${categoryId}"}}&s={"name":-1}`
  );
  const subCategoryList = await response.json();

  return subCategoryList;
};
