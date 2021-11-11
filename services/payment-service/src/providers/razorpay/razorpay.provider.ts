import {Provider, inject} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {Orders} from '../../models';
import Handlebars from 'handlebars';
import {OrdersRepository, TransactionsRepository} from '../../repositories';
import {RazorpayPaymentGateway, IRazorpayConfig} from './types';
import {razorpayCreateTemplate} from '../../templates';
import {RazorpayBindings} from './keys';
import {ILogger, LOGGER} from '@sourceloop/core';
import {ResponseMessage, Status} from '../../enums';
const Razorpay = require('razorpay');

export class RazorpayProvider implements Provider<RazorpayPaymentGateway> {
  constructor(
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(RazorpayBindings.RazorpayConfig)
    private readonly config?: IRazorpayConfig,
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
      create: async (payorder: Orders, paymentTemplate: string) => {
        let razorpayTemplate: unknown;
        const transactions = await this.transactionsRepository.find({
          where: {orderId: payorder.id},
        });
        const transRes = transactions[0]?.res;
        if (payorder?.status === Status.Paid) {
          return {
            res: 'Payment already Done for this Order',
            status: Status.AlreadyPaid,
            orderId: payorder.id,
          };
        }
        const razorPayOptions = {
          amount: payorder.totalAmount, // amount in the smallest currency unit
          currency: payorder.currency,
        };
        if (transactions.length === 0) {
          await instance.orders.create(
            razorPayOptions,
            async (err: unknown, order: DataObject<{id: string}>) => {
              if (err) {
                this.logger.info(`${err}, err`);
              }
              if (order) {
                payorder.metaData = {
                  razorpayOrderID: order.id,
                };
                const template = Handlebars.compile(
                  paymentTemplate || razorpayCreateTemplate,
                );

                const data = {
                  razorpayKey: razorpayKey,
                  totalAmount: payorder.totalAmount,
                  orderId: order.id,
                };
                razorpayTemplate = template(data);
              }
            },
          );
          await this.ordersRepository.updateById(payorder.id, {...payorder});
        } else {
          const template = Handlebars.compile(
            paymentTemplate || razorpayCreateTemplate,
          );

          const data = {
            razorpayKey: razorpayKey,
            totalAmount: payorder.totalAmount,
            orderId: transRes.gatewayOrderRes.razorpayOrderID,
          };
          razorpayTemplate = template(data);
        }
        const transactionData = {
          id: uuidv4(),
          amountPaid: payorder.totalAmount,
          currency: payorder.currency,
          status: Status.Draft,
          orderId: payorder.id,
          paymentGatewayId: payorder.paymentGatewayId,
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
        const order = await this.ordersRepository.find({
          where: {
            'metaData.razorpayOrderID': `${chargeResponse.razorpay_order_id}`,
          },
        });
        let chargeComplete = false;
        if (
          chargeResponse.razorpay_payment_id &&
          order.length > 0 &&
          order[0].totalamount
        ) {
          await instance.payments.capture(
            chargeResponse.razorpay_payment_id,
            order[0].totalamount,
            order[0].currency,
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
            async (err: unknown, resdata: DataObject<{status: string}>) => {
              if (err) {
                this.logger.info(`${err}, err`);
              }
              if (
                resdata.status === Status.Captured ||
                resdata.status === Status.Paid
              ) {
                order[0].status = Status.Paid;
                await this.ordersRepository.updateById(order[0].id, {
                  ...order[0],
                });
                const transactions = await this.transactionsRepository.find({
                  where: {orderId: order[0].id},
                });
                transactions[0].res = {
                  ...transactions[0].res,
                  chargeResponse: resdata,
                };
                await this.transactionsRepository.updateById(
                  transactions[0].id,
                  {...transactions[0]},
                );
                chargeComplete = true;
              }
            },
          );
        }
        if (chargeComplete) {
          return {res: ResponseMessage.Sucess, orderId: order[0].id};
        } else {
          return {res: ResponseMessage.NotSucess, orderId: order[0].id};
        }
      },

      refund: async (transactionId: string) => {
        const transaction = await this.transactionsRepository.findById(
          transactionId,
        );
        const paymentId = transaction?.res?.chargeResponse?.id;
        const refund = await instance.payments.refund(paymentId);
        transaction.res.refundDetails = refund;
        transaction.status = Status.Refund;
        if (refund) {
          await this.transactionsRepository.updateById(transactionId, {
            ...transaction,
          });
          return refund;
        } else {
          return {
            err: ResponseMessage.NotSucess,
            message: 'please check PaymentId',
          };
        }
      },
    };
  }
}
