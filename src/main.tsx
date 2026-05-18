import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./i18n";
import { store } from "./store";

import { LanguageProvider } from "./contexts/LanguageContext";

import App from "./App";

import "./reset.scss";
import "./settings.scss";
import "./media.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </LanguageProvider>
);
