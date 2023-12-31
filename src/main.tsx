// LIBRARIES IMPORTS
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// COMPONENTS IMPORTS
import App from "./App.tsx";

import "./reset.scss";
import "./settings.scss";
import "./media.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
