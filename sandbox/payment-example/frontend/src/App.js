import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Subsciption  from './subscription';
import Checkout from './checkout';
import OrdersPage from './orders';
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
             render={(props) => <Subsciption {...props} />}/>
            <Route path="/checkout"
            render={(props) => <Checkout {...props} />}/>
            <Route exact path="/orders"
            render={(props) => <OrdersPage {...props} />}/>
          </Switch>
        </div>
      </Router>
    );
  }
export default App;
