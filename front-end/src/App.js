import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";
import "./App.css"
// import background from "./images/Untitled-design.PNG"

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <div >
    <Switch>
      <Route path="/">
        <Layout />
      </Route>
    </Switch>
</div>
  );
}

export default App;
