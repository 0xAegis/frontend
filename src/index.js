import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { GoogleOauthRedirect } from "./routes/oauth";
import { store } from "./store.js";
import { UserProfile } from "./features/users/UserProfile";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="user">
              <Route path=":username" element={<UserProfile />} />
            </Route>
          </Route>
          <Route
            path="/oauth-redirect/google"
            element={<GoogleOauthRedirect />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
