import React from "react";
import { Route, Switch } from "wouter";
import Users from "../pages/users";
import Roles from "../pages/roles";
import Permissions from "../pages/permissions";
import Security from "../pages/security";
import Session from "../pages/session";
import Profile from "../pages/profile";

function Dashboard() {
  return <h1>Welcome to AuthGuard Dashboard</h1>;
}

export const AppRoutes = () => (
  <Switch>
    <Route path="/" component={Dashboard} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/users" component={Users} />
    <Route path="/roles" component={Roles} />
    <Route path="/permissions" component={Permissions} />
    <Route path="/security" component={Security} />
    <Route path="/session" component={Session} />
    <Route path="/profile" component={Profile} />
    <Route> <h2>404 Not Found</h2> </Route>
  </Switch>
);
