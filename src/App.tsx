import { Route, Switch } from "wouter";

import HomePage from "./pages/HomePage";
import CareerSplatPage from "./pages/CareerSplatPage";
import { DatenschutzPage, ImpressumPage } from "./pages/LegalPage";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/career-splat" component={CareerSplatPage} />
      <Route path="/impressum" component={ImpressumPage} />
      <Route path="/datenschutz" component={DatenschutzPage} />
      <Route component={HomePage} />
    </Switch>
  );
}
