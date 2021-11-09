import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import SubsciptionPage  from './SubscriptionPage';
import CheckoutPage from './CheckoutPage';
import OrdersPage from './OrdersPage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/"
             render={(props) => <SubsciptionPage {...props} />}/>
            <Route path="/checkout"
            render={(props) => <CheckoutPage {...props} />}/>
            <Route exact path="/orders"
            render={(props) => <OrdersPage {...props} />}/>
          </Switch>
        </div>
      </Router>
    );
  }
export default App;
