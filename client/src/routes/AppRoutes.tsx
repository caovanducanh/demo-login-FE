import React from "react";
import { Route, Switch } from "wouter";

import Users from "../pages/admin/users";
import Roles from "../pages/admin/roles";
import Permissions from "../pages/admin/permissions";
import BranchManagement from "../pages/admin/branches";
import Session from "../pages/common/session";
import Profile from "../pages/common/profile";
import HomePage from "../pages/home";

function Dashboard() {
  return <h1>Welcome to AuthGuard Dashboard</h1>;
}

const AppRoutes = () => (
  <Switch>
    <Route path="/" component={HomePage} />
    <Route path="/home" component={HomePage} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/users" component={Users} />
    <Route path="/roles" component={Roles} />
    <Route path="/permissions" component={Permissions} />
    <Route path="/branches" component={BranchManagement} />
    <Route path="/session" component={Session} />
    <Route path="/profile" component={Profile} />
    <Route> <h2>404 Not Found</h2> </Route>
  </Switch>
);

export default AppRoutes;
