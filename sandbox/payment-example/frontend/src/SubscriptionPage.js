import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from "mdbreact";
import {useHistory} from "react-router-dom";

export default function SubscriptionPage() {
    const history = useHistory();
    function handleCheckOut(amount){
      const location = {
          pathname: '/checkout',
          state: { amount: amount }
        };
        history.push(location);
  }
  const backgroundImageUrl = 'url("https://mdbootstrap.com/img/Photos/Others/pricing-table%20(6).jpg")';
    return (
    <section className="text-center my-5">
      <h2 className="h1-responsive font-weight-bold text-center my-5">
        Our Subscription plans
      </h2>
      <p className="grey-text text-center w-responsive mx-auto mb-5">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit,
        error amet numquam iure provident voluptate esse quasi, veritatis
        totam voluptas nostrum quisquam eum porro a pariatur veniam.
      </p>
      <MDBRow>
        <MDBCol lg="4" md="12" className="mb-lg-0 mb-4">
          <MDBCard
            className="card-image"
            style={{
              backgroundImage:backgroundImageUrl
            }}
          >
            <div className="text-white text-center pricing-card d-flex align-items-center rgba-stylish-strong py-3 px-3 rounded">
              <MDBCardBody>
                <h5>Basic</h5>
                <div className="price pt-0">
                  <h2 className="number mb-0">₹ 150</h2>
                </div>
                <ul className="striped mb-0">
                  <li>
                    <p>
                      <strong>2</strong> project
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>100</strong> components
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>150</strong> features
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>200</strong> members
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>250</strong> messages
                    </p>
                  </li>
                </ul>
                <MDBBtn outline color="white" onClick={() => { handleCheckOut(30) }}>
                  Subscribe now
                </MDBBtn>
              </MDBCardBody>
            </div>
          </MDBCard>
        </MDBCol>
        <MDBCol lg="4" md="12" className="mb-lg-0 mb-4">
          <MDBCard
            className="card-image"
            style={{
              backgroundImage:backgroundImageUrl
            }}
          >
            <div className="text-white text-center pricing-card d-flex align-items-center rgba-teal-strong py-3 px-3 rounded">
              <MDBCardBody>
                <h5>Pro</h5>
                <div className="price pt-0">
                  <h2 className="number mb-0">₹ 200</h2>
                </div>
                <ul className="striped mb-0">
                  <li>
                    <p>
                      <strong>3</strong> projects
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>200</strong> components
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>250</strong> features
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>300</strong> members
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>350</strong> messages
                    </p>
                  </li>
                </ul>
                <MDBBtn outline color="white" onClick={() => { handleCheckOut(30) }}>
                  Subscribe now
                </MDBBtn>
              </MDBCardBody>
            </div>
          </MDBCard>
        </MDBCol>
        <MDBCol lg="4" md="12" className="mb-lg-0 mb-4">
          <MDBCard
            className="card-image"
            style={{
              backgroundImage:backgroundImageUrl
            }}
          >
            <div className="text-white text-center pricing-card d-flex align-items-center rgba-stylish-strong py-3 px-3 rounded">
              <MDBCardBody>
                <h5>Enterprise</h5>
                <div className="price pt-0">
                  <h2 className="number mb-0"> ₹ 100 </h2>
                </div>
                <ul className="striped mb-0">
                  <li>
                    <p>
                      <strong>1</strong> projects
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>300</strong> components
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>350</strong> features
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>400</strong> members
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>450</strong> messages
                    </p>
                  </li>
                </ul>
                <MDBBtn outline color="white" onClick={() => { handleCheckOut(30) }}>
                  Subscribe now
                </MDBBtn>
              </MDBCardBody>
            </div>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </section>
    )
}
