import React from 'react';
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBBtn,
} from 'mdbreact';
import {useHistory} from "react-router-dom";



const OrdersPage = () => {
const history = useHistory();
function handleCheckOut(amount){

  const location = {
      pathname: '/checkout',
      state: { amount: amount , type : 'orders'}
    };
    history.push(location);

}
  return (
    <section className='text-center my-5'>
      <h2 className='h1-responsive font-weight-bold text-center my-5'>Our Bestsellers</h2>
      <p className='grey-text text-center w-responsive mx-auto mb-5'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, error amet numquam iure provident voluptate esse quasi, veritatis
        totam voluptas nostrum quisquam eum porro a pariatur veniam.
      </p>
          <MDBRow style={{marginLeft:'30px', marginRight:'30px'}}>
              <MDBCol md='4'>
                <MDBCard narrow ecommerce className='mb-2'>
                  <MDBCardImage
                    cascade
                    top
                    src='https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Products/img%20(39).jpg'
                    alt='sample photo'
                  />
                  <MDBCardBody cascade>
                    <a href='#!' className='text-muted'>
                      <h5>Shoes</h5>
                    </a>
                    <MDBCardTitle>
                      <strong>
                        <a href='#!'>Leather boots</a>
                      </strong>
                    </MDBCardTitle>
                    <MDBCardText>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci.</MDBCardText>
                    <MDBCardFooter className='px-1'>
                      <span className='float-left'>6900 ₹</span>
                      <span className='float-right'>
                         <MDBBtn gradient="peach" onClick={() => { handleCheckOut(6900) }} >Buy Now</MDBBtn>
                      </span>
                    </MDBCardFooter>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md='4' className='clearfix d-none d-md-block'>
                <MDBCard narrow ecommerce className='mb-2'>
                  <MDBCardImage
                    cascade
                    top
                    src='https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Products/img%20(22).jpg'
                    alt='sample photo'
                  />
                  <MDBCardBody cascade>
                    <a href='#!' className='text-muted'>
                      <h5>Jeans</h5>
                    </a>
                    <MDBCardTitle>
                      <strong>
                        <a href='#!'>Slim jeans</a>
                      </strong>
                    </MDBCardTitle>
                    <MDBCardText>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci.</MDBCardText>
                    <MDBCardFooter className='px-1'>
                      <span className='float-left'>9900 ₹</span>
                      <span className='float-right'>
                         <MDBBtn gradient="peach" onClick={() => { handleCheckOut(9900) }}>Buy Now</MDBBtn>
                      </span>
                    </MDBCardFooter>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md='4' className='clearfix d-none d-md-block'>
                <MDBCard narrow ecommerce className='mb-2'>
                  <MDBCardImage cascade top src='https://mdbootstrap.com/img/Photos/Others/img%20(31).jpg' alt='sample photo' />
                  <MDBCardBody cascade>
                    <a href='#!' className='text-muted'>
                      <h5>Shorts</h5>
                    </a>
                    <MDBCardTitle>
                      <strong>
                        <a href='#!'>Denim shorts</a>
                      </strong>
                    </MDBCardTitle>
                    <MDBCardText>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci.</MDBCardText>
                    <MDBCardFooter className='px-1'>
                      <span className='float-left'>4900 ₹</span>
                      <span className='float-right'>
                    <MDBBtn gradient="peach" onClick={() => { handleCheckOut(4900) }}>Buy Now</MDBBtn>
                      </span>
                    </MDBCardFooter>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
          </MDBRow>
    </section>
  );
};

export default OrdersPage;
