"use server";
import { config } from "@/config";
import { ResponseSchema, SubCategorySchema, SubCategory } from "@/schema";
import { z } from "zod";

export const getSubCategoryListAction = async (categoryId: string) => {
  const response = await fetch(
    `${config.apiBaseUrl}/sub-categories?q={"category":{"v":"${categoryId}"}}&s={"name":-1}`
  );
  const subCategoryList = ResponseSchema<SubCategory[]>(
    z.array(SubCategorySchema)
  ).parse(await response.json());

  return subCategoryList;
};
