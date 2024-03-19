import dotenv from "dotenv";

dotenv.config();

import { z } from "zod";

export const BACKEND_ENV = z
	.object({
		PORT: z.coerce.number().default(5000),
		MONGO_DB_URI: z.string().min(1),
		JWT_SECRET: z.string().min(1),
	})
	.parse(process.env);
