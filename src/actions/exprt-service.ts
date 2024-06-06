"use server";
import { config } from "@/config";

export const getCategoryListAction = async () => {
  const response = await fetch(`${config.apiBaseUrl}/categories?s={"name":-1}`);
  const categoryList = await response.json();

  return categoryList;
};

export const getSubCategoryListAction = async (categoryId: string) => {
  const response = await fetch(
    `${config.apiBaseUrl}/sub-categories?q={"category":{"v":"${categoryId}"}}&s={"name":-1}`
  );
  const subCategoryList = await response.json();

  return subCategoryList;
};

export const getServiceListAction = async (subCategoryId: string) => {
  const response = await fetch(
    `${config.apiBaseUrl}/services?q={"subCategory":{"v":"${subCategoryId}"}}&s={"name":1}`
  );
  const serviceList = await response.json();

  return serviceList;
};
