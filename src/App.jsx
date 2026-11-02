import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHashRouter, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import SoldiersPage from "./pages/Soldiers";

const queryClient = new QueryClient();

function Duties() {
	return <h1>Duties Card View</h1>;
}

function Admin() {
	return <h1>Admin Table View...</h1>;
}

function Home() {
	return <h1>Welcome to home page!</h1>;
}

const router = createHashRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "/soldiers",
				element: <SoldiersPage />,
			},
			{
				path: "/duties",
				element: <Duties />,
			},
			{
				path: "/admin",
				element: <Admin />,
			},
		],
	},
]);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
