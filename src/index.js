import React from "react";
import ReactDOM from "react-dom";
import { createContext } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import { GoogleOauthRedirect } from "./routes/oauth";
import { AppStore } from "./store.js";
import { UserProfile } from "./features/users/user-profile/UserProfile";
import { FollowedPage } from "./features/users/followed-page/FollowedPage";
import { CreateUser } from "./features/auth/create-user/CreateUser";
import { Home } from "./features/users/home-page/Home";

export const AppContext = createContext();
const appStore = new AppStore();

ReactDOM.render(
  <React.StrictMode>
    <AppContext.Provider value={appStore}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/create-account" element={<CreateUser />} />
            <Route path="user">
              <Route path=":userPubKey/followed" element={<FollowedPage />} />
              <Route path=":userPubKey" element={<UserProfile />} />
            </Route>
            <Route path="/" element={<Home />}></Route>
          </Route>
          <Route
            path="/oauth-redirect/google"
            element={<GoogleOauthRedirect />}
          />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
