export const fetchDuties = async ({ pageParam = 1, pageSize }) => {
	const response = await fetch(`/duties?page=${pageParam}&limit=${pageSize}`);

	if (!response.ok) throw new Error("Network response was not ok");

	return response.json();
};
