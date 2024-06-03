"use server";
import { ofetch } from "ofetch";

import { config } from "@/config";

export const fetchApi = ofetch.create({
  baseURL: config.apiBaseUrl,
});
