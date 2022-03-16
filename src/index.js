import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { GoogleOauthRedirect } from "./routes/oauth";
import { store } from "./store.js";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Provider store={store}>
              <App />
            </Provider>
          }
        />
        <Route
          path="/oauth-redirect/google"
          element={<GoogleOauthRedirect />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
