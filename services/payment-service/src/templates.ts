// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const razorpayCreateTemplate = `<html>
  <head><title>Order in-process. Please wait ...</title>
  <style>.razorpay-payment-button{display:none;}</style></head>
  <body>
  <form name="payment" action="/transactions/charge?method=razorpay" method="POST"> 
  <script src="https://checkout.razorpay.com/v1/checkout.js"  data-key=
  {{razorpayKey}}
  data-amount={{totalAmount}}
  data-buttontext="Pay with Razorpay" data-order_id=
  {{orderId}}
  data-theme.color="#57AB5B"
  ></script>
  <input type="hidden" value="Hidden Element" name="hidden">
  </form>
  <script>
  document.querySelector(".razorpay-payment-button").click()
  </script>
  </body></html>`;

export const stripeCreateTemplate = `<html>
  <title>Stripe Payment Demo</title>
  <body>
  <h3>Welcome to Payment Gateway</h3>
  <form action="/transactions/charge?method=stripe&orderId={{orderId}}" method="POST">
  <script src="//checkout.stripe.com/v2/checkout.js" class="stripe-button" data-key=
  {{publishKey}}
  data-amount=
  {{orderAmount}}
  data-currency={{currency}} data-name="" data-description="Test Stripe" data-locale="auto" >
   </script>
  </form>
  </body>
  </html>`;

export const razorpaySubscriptionCreateTemplate = `<html>
  <head><title>Order in-process. Please wait ...</title>
  <style>.razorpay-payment-button{display:none;}</style></head>
  <body>
  <form name="payment" action="/subscription/transaction/charge?method=razorpay" method="POST"> 
  <script src="https://checkout.razorpay.com/v1/checkout.js"  data-key=
  {{razorpayKey}}
  data-subscription_id={{subscriptionId}}
  data-theme.color="#57AB5B"
  ></script>
  <input type="hidden" value="Hidden Element" name="hidden">
  </form>
  <script>
  document.querySelector(".razorpay-payment-button").click()
  </script>
  </body></html>`;

export const stripeSubscriptionCreateTemplate = `<html>
  <title>Stripe Payment Demo</title>
  <body>
  <h3>Welcome to Payment Gateway</h3>
  <form action="/subscription/transaction/charge?method=stripe&subscriptionId={{subscriptionId}}" 
  method="POST">
  <script src="//checkout.stripe.com/v2/checkout.js" class="stripe-button" data-key=
  {{publishKey}}
  data-amount=
  {{orderAmount}}
  data-currency={{currency}} data-name="" data-description="Test Stripe" data-locale="auto">
   </script>
  </form>
  </body>
  </html>`;
