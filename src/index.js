import React from "react";
import ReactDOM from "react-dom";
import { createContext } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";

import App from "./App";
import { GoogleOauthRedirect } from "./routes/oauth";
import { AppStore } from "./store.js";
import { UserProfile } from "./features/users/user-profile/UserProfile";
import { CreateUser } from "./features/auth/create-user/CreateUser";

export const AppContext = createContext();
const appStore = new AppStore();

ReactDOM.render(
  <React.StrictMode>
    <AppContext.Provider value={appStore}>
      <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/create-account" element={<CreateUser />} />
              <Route path="user">
                <Route path=":userPubKey" element={<UserProfile />} />
              </Route>
            </Route>
            <Route
              path="/oauth-redirect/google"
              element={<GoogleOauthRedirect />}
            />
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </AppContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
