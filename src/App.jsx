import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

function Soldiers() {
  return <h1>Soldiers Card View...</h1>;
}

function Duties() {
  return <h1>Duties Card View</h1>;
}

function Admin() {
  return <h1>Admin Table View...</h1>;
}

function Home() {
  return <h1>Welcome to home page!</h1>;
}

const router = createBrowserRouter([
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
        element: <Soldiers />,
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
  return <RouterProvider router={router} />;
}

export default App;
