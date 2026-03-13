import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// Client safe config
export const config = {
	projectId: "xk59bvmh",
	dataset: "production",
	apiVersion: "2024-01-01",
	useCdn: false,
};
export const client = createClient(config);

// Admin level client used for backend

const adminConfig = {
	...config,
	token: process.env.SANITY_API_TOKEN,
};
export const adminClient = createClient(adminConfig);

// Image Url builder
const builder = createImageUrlBuilder(config);
export const urlFor = (source: any) => builder.image(source);
