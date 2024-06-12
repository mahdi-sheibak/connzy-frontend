import { ZodSchema, z } from "zod";

export const ResponseSchema = <T>(schema: ZodSchema<T>) =>
  z.object({
    data: z.array(schema),
  });

export const CategorySchema = z.object({
  name: z.string(),
  _id: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const SubCategorySchema = z.object({
  name: z.string(),
  _id: z.string(),
  category: CategorySchema,
});
export type SubCategory = z.infer<typeof SubCategorySchema>;

export const ServiceSchema = z.object({
  name: z.string(),
  _id: z.string(),
  subCategory: SubCategorySchema,
  steps: z.array(z.unknown()),
});
export type Service = z.infer<typeof ServiceSchema>;

export const GoogleLoginSchema = z.object({
  data: z.string(),
});

export const PostResponse = <T>(schema: ZodSchema<T>) =>
  z.object({
    status: z.string(),
    statusCode: z.string(),
    message: z.object({
      text: z.string(),
      type: z.string(),
    }),
    errors: z.array(
      z.object({
        message: z.string(),
        field: z.string(),
      })
    ),
    data: schema,
  });
