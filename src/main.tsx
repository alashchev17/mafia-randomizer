// LIBRARIES IMPORTS
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// COMPONENTS IMPORTS
import App from "./App.tsx";

// ROUTER-PAGES IMPORTS
import MainPage from "./pages/MainPage.tsx";
import RolesInfoPage from "./pages/RolesInfoPage.tsx";
import SetupPage from "./pages/SetupPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

import "./reset.scss";
import "./settings.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "welcome",
        element: <MainPage />,
      },
      {
        path: "information",
        element: <RolesInfoPage />,
      },
      {
        path: "setup/:setupId",
        element: <SetupPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
