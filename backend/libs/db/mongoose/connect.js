import { connect } from "mongoose";
import { BACKEND_ENV } from "../../utils/env.js";

export default async function connectToMongoDB() {
	try {
		const conn = await connect(BACKEND_ENV.MONGO_DB_URI, {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// useCreateIndex: true,
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
		process.exit(1);
	}
}
