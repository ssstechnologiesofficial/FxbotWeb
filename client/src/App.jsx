import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ModernDashboard from "./pages/ModernDashboard";
import Profile from "./pages/Profile";
import Fund from "./pages/Fund";
import ReferralTree from "./pages/ReferralTree";
import Deposit from "./pages/Deposit";
import Withdrawal from "./pages/Withdrawal";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/dashboard" component={ModernDashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/fund" component={Fund} />
        <Route path="/referral-tree" component={ReferralTree} />
        <Route path="/deposit" component={Deposit} />
        <Route path="/withdrawal" component={Withdrawal} />
        <Route path="/admin" component={AdminDashboard} />
      </Switch>
    </div>
  );
}

export default App;
