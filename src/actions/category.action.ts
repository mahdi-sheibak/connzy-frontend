"use server";

import { config } from "@/config";
import { CategorySchema, ResponseSchema, Category } from "@/schema";

export const getCategoryListAction = async () => {
  const response = await fetch(`${config.apiBaseUrl}/categories?s={"name":-1}`);
  const categoryList = ResponseSchema<Category>(CategorySchema).parse(
    await response.json(),
  );

  return categoryList;
};
