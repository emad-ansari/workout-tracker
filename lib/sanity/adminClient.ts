import { createClient } from "@sanity/client";

export const config = {
	projectId: "xk59bvmh",
	dataset: "production",
	apiVersion: "2024-01-01",

	useCdn: false,
};

// Admin level client used for backend

const adminConfig = {
	...config,
	token: process.env.SANITY_API_TOKEN,
};
export const adminClient = createClient(adminConfig);
