"use server";
import { config } from "@/config";
import { Service } from "@/types";

export const getServiceListAction = async (subCategoryId: string) => {
  const response = await fetch(
    `${config.apiBaseUrl}/services?q={"subCategory":{"v":"${subCategoryId}"}}&s={"name":1}`
  );
  const serviceList: { data: Service[] } = await response.json();

  return serviceList;
};

export const getServiceListByIdsAction = async (serviceListIds: string[]) => {
  const response = await fetch(
    `${config.apiBaseUrl}/services?q={"_id":{"v":{"$in":${JSON.stringify(
      serviceListIds
    )}}}}&s={"name":1}`
  );
  const serviceList: { data: Service[] } = await response.json();

  return serviceList;
};
