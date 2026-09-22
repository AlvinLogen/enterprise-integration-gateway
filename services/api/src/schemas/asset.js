import { z } from "zod";

export const AssetInput = z.object({
  name: z.string().min(1).max(120),
  kind: z.enum(["device", "record", "location"]),
});

export const ListQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
