import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHashRouter, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import AdminPage from "./pages/Admin";
import DutiesPage from "./pages/Duties";
import SoldiersPage from "./pages/Soldiers";

const queryClient = new QueryClient();

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
				element: <DutiesPage />,
			},
			{
				path: "/admin",
				element: <AdminPage />,
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
