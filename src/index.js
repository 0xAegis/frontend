import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import { GoogleOauthRedirect } from "./routes/oauth";
import { AppStore } from "./store.js";
import { UserProfile } from "./features/users/user-profile/UserProfile";

const appStore = new AppStore();
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App appStore={appStore} />}>
          <Route path="user">
            <Route
              path=":userPubKey"
              element={<UserProfile appStore={appStore} />}
            />
          </Route>
        </Route>
        <Route
          path="/oauth-redirect/google"
          element={<GoogleOauthRedirect />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
