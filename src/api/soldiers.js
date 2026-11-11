export const postSoldier = async (soldier) => {
	const response = await fetch("/soldiers/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(soldier),
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		throw new Error(
			errorData?.message || "Server error occurred. Please try again.",
		);
	}
	return response.json();
};

export const fetchSoldiers = async ({ pageParam = 1, pageSize }) => {
	const response = await fetch(`/soldiers?page=${pageParam}&limit=${pageSize}`);

	if (!response.ok) throw new Error("Network response was not ok");

	return response.json();
};

export const deleteSoldier = async (soldierId) => {
	const response = await fetch(`/soldiers/${soldierId}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		throw new Error(
			errorData?.message || "Server error occurred. Please try again.",
		);
	}
};
