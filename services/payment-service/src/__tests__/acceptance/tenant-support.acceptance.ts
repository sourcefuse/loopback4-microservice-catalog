import {expect} from '@loopback/testlab';
import {
  Orders,
  PaymentGateways,
  Subscriptions,
  Templates,
  Transactions,
} from '../../models/tenant-support';
import {TestPaymentApplication} from '../fixtures/application';

let app: TestPaymentApplication;
const setup = async () => {
  app = new TestPaymentApplication({
    name: 'PaymentTenantSupport',
  });
  await app.boot();
};

beforeEach(setup);

describe('Tenant Support in Payment Service', () => {
  it('Tenant supported instance of Orders model', async () => {
    const orders = new (await app.get<typeof Orders>('models.Orders'))();
    expect(orders).to.be.instanceOf(Orders);
  });

  it('Tenant supported instance of PaymentGateways model', async () => {
    const gateways = new (await app.get<typeof PaymentGateways>(
      'models.PaymentGateways',
    ))();
    expect(gateways).to.be.instanceOf(PaymentGateways);
  });

  it('Tenant supported instance of Subscriptions model', async () => {
    const subscriptions = new (await app.get<typeof Subscriptions>(
      'models.Subscriptions',
    ))();
    expect(subscriptions).to.be.instanceOf(Subscriptions);
  });

  it('Tenant supported instance of Templates model', async () => {
    const templates = new (await app.get<typeof Templates>(
      'models.Templates',
    ))();
    expect(templates).to.be.instanceOf(Templates);
  });

  it('Tenant supported instance of Transactions model', async () => {
    const transactions = new (await app.get<typeof Transactions>(
      'models.Transactions',
    ))();
    expect(transactions).to.be.instanceOf(Transactions);
  });
});
