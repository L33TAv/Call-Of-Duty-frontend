export const fetchDuties = async ({ pageParam = 1, pageSize }) => {
	const response = await fetch(`/duties?page=${pageParam}&limit=${pageSize}`);

	if (!response.ok) throw new Error("Network response was not ok");

	return response.json();
};

export const postDuty = async (duty) => {
	const response = await fetch("/duties/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(duty),
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message);
	}
	return response.json();
};
