import { Route, Switch } from "wouter";

import HomePage from "./pages/HomePage";
import { DatenschutzPage, ImpressumPage } from "./pages/LegalPage";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/impressum" component={ImpressumPage} />
      <Route path="/datenschutz" component={DatenschutzPage} />
      <Route component={HomePage} />
    </Switch>
  );
}
