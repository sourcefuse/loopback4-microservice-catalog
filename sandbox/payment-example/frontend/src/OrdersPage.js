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
import {useHistory} from 'react-router-dom';

const OrdersPage = () => {
  const history = useHistory();
  function handleCheckOut(amount) {
    const location = {
      pathname: '/checkout',
      state: {amount: amount, type: 'orders'},
    };
    history.push(location);
  }

  const dummyDescription =
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, error amet numquam iure provident voluptate esse quasi,veritatis';

  const productList = [
    {
      name: 'Shoes',
      category: 'Leather boots',
      imageUrl:
        'https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Products/img%20(39).jpg',
      description: dummyDescription,
      price: 6900,
    },
    {
      name: 'Jeans',
      category: 'Slim Jeans',
      imageUrl:
        'https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Products/img%20(22).jpg',
      description: dummyDescription,
      price: 9900,
    },
    {
      name: 'Shorts',
      category: 'Denim Shorts',
      imageUrl: 'https://mdbootstrap.com/img/Photos/Others/img%20(31).jpg',
      description: dummyDescription,
      price: 4900,
    },
  ];

  return (
    <section className="text-center my-5">
      <h2 className="h1-responsive font-weight-bold text-center my-5">
        Our Bestsellers
      </h2>
      <p className="grey-text text-center w-responsive mx-auto mb-5">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, error
        amet numquam iure provident voluptate esse quasi, veritatis totam
        voluptas nostrum quisquam eum porro a pariatur veniam.
      </p>
      <MDBRow style={{marginLeft: '30px', marginRight: '30px'}}>
        {productList.map((product, index) => {
          return (
            <MDBCol md="4" key={product.name}>
              <MDBCard narrow ecommerce className="mb-2">
                <MDBCardImage
                  cascade
                  top
                  src={product.imageUrl}
                  alt="sample photo"
                />
                <MDBCardBody cascade>
                  <a href="#!" className="text-muted">
                    <h5>{product.name}</h5>
                  </a>
                  <MDBCardTitle>
                    <strong>
                      <a href="#!">{product.category}</a>
                    </strong>
                  </MDBCardTitle>
                  <MDBCardText>{product.description}</MDBCardText>
                  <MDBCardFooter className="px-1">
                    <span className="float-left">{product.price} ₹</span>
                    <span className="float-right">
                      <MDBBtn
                        gradient="peach"
                        onClick={() => {
                          handleCheckOut(productList[index].price);
                        }}
                      >
                        Buy Now
                      </MDBBtn>
                    </span>
                  </MDBCardFooter>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
        })}
      </MDBRow>
    </section>
  );
};

export default OrdersPage;
