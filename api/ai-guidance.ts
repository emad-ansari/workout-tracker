import { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { exerciseName } = req.body;

	if (!exerciseName) {
		return res.status(404).json({ error: "Exercise name is required!" });
	}

	const prompt = `
	You are a fitness coach.
	You are given an exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required.
	Explain the exercise in detail and for a beginner.

	The exercise name is: ${exerciseName}

	Keep it short and concise. Use markdown formatting.

	Use the following format:

	## Equipment Required

	## Instructions

	### Tips

	### Variations

	### Safety

	keep spacing between the headings and the content.

	Always use headings and subheadings.
	`;

	try {
		const completion = await groq.chat.completions.create({
			model: "llama-3.1-8b-instant",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
		});

		const guidance = completion.choices[0].message.content;
		res.status(200).json({ guidance });
	} catch (error) {
		console.log("ERROR_FETCHING_AI_GUIDANCE: ", error);
		return res.status(500).json({ error: "Error fetching in AI guidance" });
	}
}
