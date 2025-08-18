import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardEnhanced from "./pages/DashboardEnhanced";
import Profile from "./pages/Profile";
import Fund from "./pages/Fund";
import ReferralTree from "./pages/ReferralTree";
import Deposit from "./pages/Deposit";
import Withdrawal from "./pages/Withdrawal";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={DashboardEnhanced} />
        <Route path="/profile" component={Profile} />
        <Route path="/fund" component={Fund} />
        <Route path="/referral-tree" component={ReferralTree} />
        <Route path="/deposit" component={Deposit} />
        <Route path="/withdrawal" component={Withdrawal} />
        <Route path="/forgot-password" component={ForgotPassword} />
      </Switch>
    </div>
  );
}

export default App;
