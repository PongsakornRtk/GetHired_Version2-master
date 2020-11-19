import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NewJobs from "./jobs/pages/NewJobs";
import UserJobs from "./jobs/pages/UserJobs";
import UpdateJobs from "./jobs/pages/UpdateJobs";
import Freelance from "./jobs/pages/Freelance";
import FreelancerDashboard from "./shared/components/Dashboard/FreelancerDashboard";
import Application from "./application/pages/Application";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId, employer } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <FreelancerDashboard />
          <Freelance />
        </Route>
        <Route path="/:userId/jobs" exact>
          <UserJobs />
        </Route>
        <Route path="/job/new" exact>
          <NewJobs />
        </Route>
        <Route path="/job/:jobId">
          <UpdateJobs />
        </Route>
        <Route path="/apply" exact>
          <Freelance />
        </Route>
        <Route path="/application/:jobId" exact>
          <Application />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <FreelancerDashboard />
          <Freelance />
        </Route>
        <Route path="/:userId/jobs" exact>
          <UserJobs />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        employer: employer,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
