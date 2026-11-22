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

export const fetchSoldiers = async ({ pageParam = 1, pageSize, name }) => {
	const params = new URLSearchParams({
		page: pageParam,
		limit: pageSize,
	});
	if (name?.trim()) {
		params.set("name", name.trim());
	}

	const response = await fetch(`/soldiers?${params}`);

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

export const patchSoldier = async ({ soldierId, newSoldier }) => {
	const response = await fetch(`/soldiers/${soldierId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newSoldier),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		throw new Error(
			errorData?.message || "Server error occurred. Please try again.",
		);
	}
};
