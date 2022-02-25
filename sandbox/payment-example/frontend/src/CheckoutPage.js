import React, {Component} from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabPane,
  MDBTabContent,
} from 'mdbreact';
import axios from 'axios';

class CheckoutPage extends Component {
  state = {
    activePill: '1',
    radio: 1,
    type: 'subscriptions',
    amount: 100,
  };

  onClick = nr => () => {
    this.setState({
      radio: nr,
    });
  };

  togglePills = tab => {
    if (this.state.activePill !== tab) {
      this.setState({
        ctivePill: tab,
      });
    }
  };

  selectNextTab = () => {
    this.setState({
      activePill: (+this.state.activePill + 2).toString(),
    });
  };

  res = response => {
    // handle success
    if (response) {
      window.location.href = response.request.responseURL;
    }
  };

  handlePayment = (amount, type) => {
    const ordersApiUrl = this.getOrdersApiUrl();
    const subscriptionApiUrl = this.getSubscriptionApiUrl();
    if (type === 'orders' && this.state.radio === 1) {
      axios
        .post(ordersApiUrl, {
          totalAmount: amount * 100, //amount
          status: 'draft',
          paymentGatewayId: '', // payment gateway id from database
          paymentmethod: 'razorpay',
          currency: 'INR',
        })
        .then(response => this.res(response));
    } else if (type === 'orders' && this.state.radio === 2) {
      axios
        .post(ordersApiUrl, {
          totalAmount: amount * 100, //amount
          status: 'draft',
          paymentGatewayId: '', // payment gateway id from database
          paymentmethod: 'stripe',
          currency: 'INR',
        })
        .then(resp => this.res(resp));
    } else if (this.state.radio === 1) {
      axios
        .post(subscriptionApiUrl, {
          totalAmount: 1000, //amount
          status: 'draft',
          paymentGatewayId: '', // payment gateway id from database
          paymentmethod: 'razorpay', //enum
          planId: '', // plan id from razorpay
          startDate: '', // Date in YYYY-MM-DD
          endDate: '', // Date in YYYY-MM-DD
          currency: 'INR',
        })
        .then(subres => this.res(subres));
    } else if (this.state.radio === 2) {
      axios
        .post(subscriptionApiUrl, {
          totalAmount: 10000, //amount
          status: 'draft',
          paymentGatewayId: '', // payment gateway id from database
          paymentmethod: 'stripe', //enum
          currency: 'INR',
          planId: '', // plan id from stripe
          startDate: '', // Date in YYYY-MM-DD
          endDate: '', // Date in YYYY-MM-DD
        })
        .then(subresp => this.res(subresp));
    }
  };
  getOrdersApiUrl() {
    const env = process.env;
    const isPortExists =
      env.REACT_APP_BASE_API_PORT_EXISTS === 'true' ? true : false;
    let ordersApiUrl = `${env.REACT_APP_BASE_API_PROTOCOL}://${env.REACT_APP_BASE_API_URL}`;
    ordersApiUrl += isPortExists ? `:${env.REACT_APP_BASE_API_PORT}/` : '/';
    ordersApiUrl += `${env.REACT_APP_ORDERS_API_PATH}`;
    return ordersApiUrl;
  }
  getSubscriptionApiUrl() {
    const env = process.env;
    const isPortExists =
      env.REACT_APP_BASE_API_PORT_EXISTS === 'true' ? true : false;
    let subscriptionApiUrl = `${env.REACT_APP_BASE_API_PROTOCOL}://${env.REACT_APP_BASE_API_URL}`;
    subscriptionApiUrl += isPortExists
      ? `:${env.REACT_APP_BASE_API_PORT}/`
      : '/';
    subscriptionApiUrl += `${env.REACT_APP_SUBSCRIPTION_API_PATH}`;
    return subscriptionApiUrl;
  }

  render() {
    const {activePill} = this.state;
    const {amount, type} = this.props.location.state;

    return (
      <MDBContainer>
        <MDBRow className="my-2" center>
          <MDBCard className="w-100">
            <MDBCardBody>
              <MDBRow>
                <MDBCol lg="8" className="mb-4">
                  <MDBNav pills color="primary" className="nav-justified">
                    <MDBNavItem>
                      <MDBNavLink
                        to="#"
                        className={activePill === '1' ? 'active' : ''}
                        onClick={() => this.togglePills('1')}
                      >
                        <strong>1. Billing</strong>
                      </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink
                        to="#"
                        className={activePill === '3' ? 'active' : ''}
                        onClick={() => this.togglePills('3')}
                      >
                        <strong>2. Payment</strong>
                      </MDBNavLink>
                    </MDBNavItem>
                  </MDBNav>
                  <MDBTabContent className="pt-4" activeItem={activePill}>
                    <MDBTabPane tabId="1">
                      <form>
                        <MDBRow>
                          <MDBCol md="6" className="mb-4">
                            <label htmlFor="firstName">First name</label>
                            <input
                              type="text"
                              id="firstName"
                              className="form-control"
                              placeholder="First Name"
                            />
                          </MDBCol>
                          <MDBCol md="6" className="mb-2">
                            <label htmlFor="lastName">Last name</label>
                            <input
                              type="text"
                              id="lastName"
                              className="form-control"
                              placeholder="Last Name"
                            />
                          </MDBCol>
                          <MDBCol>
                            <label htmlFor="email">Email</label>
                            <input
                              type="text"
                              id="email"
                              className="form-control mb-4"
                              placeholder="youremail@example.com"
                            />
                            <label htmlFor="address">Address</label>
                            <input
                              type="text"
                              id="address"
                              className="form-control mb-4"
                              placeholder="1234 Main St"
                            />
                            <label htmlFor="address-2">
                              Address 2 (optional)
                            </label>
                            <input
                              type="text"
                              id="address-2"
                              className="form-control mb-4"
                              placeholder="Apartment or suite"
                            />
                          </MDBCol>
                        </MDBRow>
                        <MDBRow>
                          <MDBCol lg="4" md="12" className="mb-4">
                            <label htmlFor="country">Country</label>
                            <select
                              className="custom-select d-block w-100"
                              id="country"
                              required
                            >
                              <option>Choose...</option>
                              <option>United States</option>
                            </select>
                            <div className="invalid-feedback">
                              Please select a valid country.
                            </div>
                          </MDBCol>
                          <MDBCol lg="4" md="6" className="mb-4">
                            <label htmlFor="state">State</label>
                            <select
                              className="custom-select d-block w-100"
                              id="state"
                              required
                            >
                              <option>Choose...</option>
                              <option>California</option>
                            </select>
                            <div className="invalid-feedback">
                              Please provide a valid state.
                            </div>
                          </MDBCol>
                          <MDBCol lg="4" md="6" className="mb-4">
                            <label htmlFor="zip">Zip</label>
                            <input
                              type="text"
                              className="form-control"
                              id="zip"
                              required
                            />
                            <div className="invalid-feedback">
                              Zip code required.
                            </div>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <div className="mb-1">
                          <input
                            type="checkbox"
                            className="form-check-input filled-in"
                            id="chekboxRules"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="chekboxRules"
                          >
                            I accept the terms and conditions
                          </label>
                        </div>
                        <div className="mb-1">
                          <input
                            type="checkbox"
                            className="form-check-input filled-in"
                            id="safeTheInfo"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="safeTheInfo"
                          >
                            Save this information for next time
                          </label>
                        </div>
                        <div className="mb-1">
                          <input
                            type="checkbox"
                            className="form-check-input filled-in"
                            id="subscribeNewsletter"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="subscribeNewsletter"
                          >
                            Subscribe to the newsletter
                          </label>
                        </div>
                        <hr />
                        <MDBBtn
                          color="primary"
                          size="lg"
                          block
                          onClick={this.selectNextTab}
                        >
                          Next step
                        </MDBBtn>
                      </form>
                    </MDBTabPane>
                    <MDBTabPane tabId="2">
                      <hr className="mb-5" />
                      <hr className="mb-4" />
                      <MDBBtn
                        color="primary"
                        size="lg"
                        block
                        onClick={this.selectNextTab}
                      >
                        Next step
                      </MDBBtn>
                    </MDBTabPane>
                    <MDBTabPane tabId="3">
                      <div className="d-block my-6">
                        <div className="mb-2">
                          <input
                            name="group2"
                            type="radio"
                            style={{height: '34px', width: '20px'}}
                            className="form-check-input with-gap"
                            id="radioWithGap4"
                            checked={this.state.radio === 1 ? true : false}
                            required
                            onClick={this.onClick(1)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="radioWithGap4"
                            style={{
                              fontSize: '1vw',
                              fontWeight: 'bold',
                              marginLeft: '1.5vw',
                              marginTop: '1.0vh',
                            }}
                          >
                            Pay with Razorpay
                          </label>
                        </div>
                        <div className="mb-2">
                          <input
                            iname="group2"
                            type="radio"
                            style={{height: '34px', width: '20px'}}
                            className="form-check-input with-gap"
                            id="radioWithGap5"
                            checked={this.state.radio === 2 ? true : false}
                            required
                            onClick={this.onClick(2)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="radioWithGap5"
                            style={{
                              fontSize: '1vw',
                              fontWeight: 'bold',
                              marginLeft: '1.5vw',
                              marginTop: '1.0vh',
                            }}
                          >
                            Pay with Stripe
                          </label>
                        </div>
                        <hr className="mb-4" />
                        <MDBBtn
                          color="primary"
                          size="lg"
                          block
                          onClick={() => this.handlePayment(amount, type)}
                        >
                          Place order
                        </MDBBtn>
                      </div>
                    </MDBTabPane>
                  </MDBTabContent>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default CheckoutPage;
