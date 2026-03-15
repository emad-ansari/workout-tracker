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



// Image Url builder
const builder = createImageUrlBuilder(config);
export const urlFor = (source: any) => builder.image(source);
