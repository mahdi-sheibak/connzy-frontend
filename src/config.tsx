import { z } from "zod";

const configSchema = z.object({
  apiBaseUrl: z.string(),
});

export const config = configSchema.parse({
  apiBaseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
});
