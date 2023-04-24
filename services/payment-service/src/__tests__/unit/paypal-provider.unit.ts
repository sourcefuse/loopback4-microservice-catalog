import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import paypal from '@paypal/checkout-server-sdk';
import {ILogger} from '@sourceloop/core';
import sinon from 'sinon';
import {Status} from '../../enums';
import {Orders, Transactions} from '../../models';
import {IPayPalConfig, PaypalProvider} from '../../providers/paypal';
import {
  OrdersRepository,
  SubscriptionsRepository,
  TransactionsRepository,
} from '../../repositories';

describe('PaypalProvider', () => {
  let ordersRepository: StubbedInstanceWithSinonAccessor<OrdersRepository>;
  let transactionsRepository: StubbedInstanceWithSinonAccessor<TransactionsRepository>;
  let subscriptionsRepository: StubbedInstanceWithSinonAccessor<SubscriptionsRepository>;
  let paypalProvider: PaypalProvider;
  const logger = {} as ILogger;
  const payorder = new Orders({
    id: '1',
    currency: 'USD',
    totalAmount: 50,
    paymentGatewayId: '123',
    status: Status.Paid,
  });
  const config = {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
  } as IPayPalConfig;
  let client: StubbedInstanceWithSinonAccessor<paypal.core.PayPalHttpClient>;

  beforeEach(() => setUp());
  afterEach(() => sinon.restore());

  describe('value()', () => {
    it('should return Payment already Done for this Order if the order status is Paid', async () => {
      // Arrange

      const paymentTemplate = 'test';

      const findOneMock = transactionsRepository.stubs.findOne;
      findOneMock.resolves();

      const result = await paypalProvider
        .value()
        .create(payorder, paymentTemplate);
      expect(result).which.eql({
        res: 'Payment already Done for this Order',
        status: 'alreadyPaid',
        orderId: '1',
      });
    });

    it('should create a new transaction and return orderPayLink and payOrderId if transaction does not exist', async () => {
      const paymentTemplate = 'test';
      const findOneMock = transactionsRepository.stubs.findOne;
      findOneMock.resolves(
        new Transactions({
          res: {
            gatewayOrderRes: {
              paypalOrderPayLink: 'test',
              paypalOrderId: '123',
            },
          },
        }),
      );
      payorder.status = Status.Draft;
      const order = client.stubs.execute;
      order.resolves({
        result: {
          id: '123',
          links: [
            {
              href: 'test',
              rel: 'approve',
            },
          ],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any); //NOSONAR
      // this any is required as paypal does not export its type.
      const result = await paypalProvider
        .value()
        .create(payorder, paymentTemplate);
      expect(result).which.eql({
        orderPayLink: 'test',
        orderId: '1',
        payOrderId: '123',
      });
    });
  });

  function setUp() {
    ordersRepository = createStubInstance(OrdersRepository);
    transactionsRepository = createStubInstance(TransactionsRepository);
    subscriptionsRepository = createStubInstance(SubscriptionsRepository);
    client = createStubInstance(paypal.core.PayPalHttpClient);
    process.env.PAYPAL_ENVIRONMENT = 'sandbox';
    paypalProvider = new PaypalProvider(
      transactionsRepository,
      ordersRepository,
      subscriptionsRepository,
      logger,
      config,
    );
    paypalProvider.client = client;
  }
});
