import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult } from "@/lib/sanity/sanity.types";
import { useUser } from "@clerk/expo";
import { defineQuery } from "groq";
import { useState } from "react";

export const getWorkoutsQuery =
	defineQuery(/* groq */ `*[_type == "workout" && userId == $userId] | order(date desc) {
		_id,
		date,
		durationSeconds,
		exercises[] {
			exercise-> {
				_id,
				name
			},
			sets[] {
				reps,
				weight,
				weightUnit,
				_type, 
				_key
			},
			_type,
			_key
		}
	}`);

export default function useWorkout() {
	const { user } = useUser();
	const [loading, setLoading] = useState<boolean>(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);

	const fetchWorkouts = async () => {
		if (!user?.id) return;
		try {
			const results: GetWorkoutsQueryResult = await client.fetch(
				getWorkoutsQuery,
				{
					userId: user?.id,
				},
			);
			setWorkouts(results);
		} catch (error) {
			console.error("FETCH_WORKOUTS_ERROR: ", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

    return {
        loading,
        refreshing, 
        workouts,
        setRefreshing,
        fetchWorkouts
    }
}
