import { useEffect, useRef } from "react";

export default function useInfiniteScroll({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	rootRef,
}) {
	const loadMoreRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ root: rootRef?.current, threshold: 0.5, rootMargin: "200px" },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage, rootRef]);

	return loadMoreRef;
}
