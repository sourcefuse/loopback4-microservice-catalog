import {Provider} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {Orders} from '../../models';
import {OrdersRepository, TransactionsRepository} from '../../repositories';
import {RazorpayPaymentGateway, IRazorpayConfig} from './types';
import {RazorpayBindings} from './keys';
import {ILogger, LOGGER} from '@sourceloop/core';
const Razorpay = require('razorpay');

export class RazorpayProvider implements Provider<RazorpayPaymentGateway> {
  constructor(
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @inject(RazorpayBindings.RazorpayConfig)
    private readonly config?: IRazorpayConfig,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  value() {
    const instance = new Razorpay({
      // eslint-disable-next-line
      key_id: this.config?.dataKey,
      // eslint-disable-next-line
      key_secret: this.config?.publishKey,
    });
    const razorpayKey = this.config?.dataKey;
    return {
      create: async (payorder: Orders) => {
        // eslint-disable-next-line
        let razorpayTemplate: any;
        const transactions = await this.transactionsRepository.find({
          // eslint-disable-next-line
          where: {order_id: payorder.id},
        });
        const transRes = transactions[0]?.res;
        if (payorder?.status === 'paid') {
          return (
            `<html>
            <title>Razorpay Payment </title>
            <body>
            <h3> Payment already done for this order ID :- ${payorder.id} </h3>
            </body>
            </html>`
          );
        }
        const razorPayOptions = {
          amount: payorder.totalAmount, // amount in the smallest currency unit
          currency: 'INR',
        };
        if (transactions.length === 0) {
          await instance.orders.create(
            razorPayOptions,
            async (err: unknown, order: DataObject<{id:string}>) => {
              if (err) {
                this.logger.info(`${err}, err`);
              }
              if (order) {
                payorder.metaData = {
                  razorpayOrderID: order.id,
                };
                razorpayTemplate =
                  `<html>
                  <head><title>Order in-process. Please wait ...</title><style>.razorpay-payment-button{display:none;}</style></head>
                  <body>
                  <form name="payment" action="/transactions/charge" method="POST"> <script src="https://checkout.razorpay.com/v1/checkout.js"  data-key=
                  ${razorpayKey}
                  data-amount=${payorder.totalAmount}
                  data-buttontext="Pay with Razorpay" data-order_id=
                  ${order.id}
                  data-theme.color="#57AB5B"
                  ></script>
                  <input type="hidden" value="Hidden Element" name="hidden">
                  </form>
                  <script>
                  document.querySelector(".razorpay-payment-button").click()
                  </script>
                  </body></html>`;
              }
            },
          );
          await this.ordersRepository.updateById(payorder.id, {...payorder});
        } else {
          razorpayTemplate =
            `<html>
            <head><title>Order in-process. Please wait ...</title><style>.razorpay-payment-button{display:none;}</style></head>
            <body>
            <form name="payment" action="/transactions/charge" method="POST"> <script src="https://checkout.razorpay.com/v1/checkout.js"  data-key=
            ${razorpayKey}
            data-amount=
            ${payorder.totalAmount}
            data-buttontext="Pay with Razorpay" data-order_id=
            ${transRes.gatewayOrderRes.razorpayOrderID}
            data-theme.color="#57AB5B"
            </script>
            <input type="hidden" value="Hidden Element" name="hidden">
            </form>
            <script>
            document.querySelector(".razorpay-payment-button").click()
            </script>
            </body></html>`;
        }
        const transactionData = {
          id: uuidv4(),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          amount_paid: payorder.totalAmount,
          status: 'draft',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          order_id: payorder.id,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          payment_gateway_id: payorder.paymentGatewayId,
          res: {
            gatewayOrderRes: payorder?.metaData,
          },
        };
        if (transactions.length === 0) {
          await this.transactionsRepository.create(transactionData);
        }
        return razorpayTemplate;
      },

      charge: async (
        chargeResponse: DataObject<{
          // eslint-disable-next-line
          razorpay_order_id: string;
          // eslint-disable-next-line
          razorpay_payment_id: string;
        }>,
      ) => {
        const order = await this.ordersRepository.execute(
          `Select * FROM orders where metadata->>'razorpayOrderID'='${chargeResponse.razorpay_order_id}';`,
        );
        if (
          chargeResponse.razorpay_payment_id &&
          order.length > 0 &&
          order[0].totalamount
        ) {
          await instance.payments.capture(
            chargeResponse.razorpay_payment_id,
            order[0].totalamount,
            'INR',
            (err: unknown, response: unknown) => {
              if (err) {
                this.logger.info(`${err}, err`);
              } else {
                //do nothing
              }
            },
          );
          await instance.payments.fetch(
            chargeResponse.razorpay_payment_id,
            // eslint-disable-next-line
            async (err: unknown, resdata: DataObject<{status:string}>) => {
              if (err) {
                this.logger.info(`${err}, err`);
              }
              if (resdata.status === 'captured' || resdata.status === 'paid') {
                order[0].status = 'paid';
                await this.ordersRepository.updateById(order[0].id, {
                  ...order[0],
                });
                const transactions = await this.transactionsRepository.find({
                  // eslint-disable-next-line
                  where: {order_id: order[0].id},
                });
                transactions[0].res = {
                  ...transactions[0].res,
                  chargeResponse: resdata,
                };
                await this.transactionsRepository.updateById(
                  transactions[0].id,
                  {...transactions[0]},
                );
              }
            },
          );
        }
        return (
          `<html>
          <title>Razorpay Payment Demo</title>
          <body>
          <h3> Success with Razorpay for order ID :- ${order[0].id} </h3>
          </body>
          </html>`
        );
      },

      refund: async (transactionId: string) => {
        const transaction = await this.transactionsRepository.findById(
          transactionId,
        );
        const paymentId = transaction?.res?.chargeResponse?.id;
        const refund = await instance.payments.refund(paymentId);
        transaction.res.refundDetails = refund;
        transaction.status = 'refund';
        if (refund) {
          await this.transactionsRepository.updateById(transactionId, {
            ...transaction,
          });
        }
        return refund;
      },
    };
  }
}
