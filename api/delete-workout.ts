import { adminClient } from "../lib/sanity/adminClient";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function hanlder(req: VercelRequest, res: VercelResponse) {
    
    if (req.method != "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
	}
    
	const { workoutId } = req.body;
    console.log('route hit, workoutId: ', workoutId);

	if (!workoutId) {
		return res.status(400).json({ error: "Workout id required!!" });
	}
	try {
		await adminClient.delete(workoutId);
		res.status(200).json({ success: true, message: "Workout deleted" });
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
}
