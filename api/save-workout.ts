import { adminClient } from "../lib/sanity/adminClient";
import { VercelRequest, VercelResponse } from "@vercel/node";

export interface WorkoutData {
	_type: string;
	userId: string;
	date: string;
	durationSeconds: number;
	exercises: {
		_type: string;
		_key: string;
		exercise: {
			_type: string;
			_ref: string;
		};
		sets: {
			_type: string;
			_key: string;
			reps: number;
			weight: number;
			weightUnit: "lbs" | "kg";
		}[];
	}[];
}

export default async function hanlder(req: VercelRequest, res: VercelResponse) {
	const { workoutData } = req.body;
	
	if (!workoutData) {
		return res.status(400).json({ error: "Workout Data is required!!" });
	}

	try {
		// save to sanity using admin client
		const result = await adminClient.create(workoutData);
		console.log("Workout saved successfully: ", result);

		res.status(200).json({
			success: true,
			workoutId: result._id,
			message: "Workout Saved successfully",
		});

	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
}
