"use server";

import { config } from "@/config";
import { CategorySchema, ResponseSchema, Category } from "@/schema";
import { z } from "zod";

export const getCategoryListAction = async () => {
  const response = await fetch(`${config.apiBaseUrl}/categories?s={"name":-1}`);
  const categoryList = ResponseSchema<Category[]>(
    z.array(CategorySchema)
  ).parse(await response.json());

  return categoryList;
};
