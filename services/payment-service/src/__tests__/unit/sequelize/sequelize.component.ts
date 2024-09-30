// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {
  OrdersController,
  PaymentGatewaysController,
  SubscriptionTransactionsController,
  SubscriptionsController,
  TemplatesController,
  TransactionSubscriptionsController,
  TransactionsController,
} from '../../../controllers';
import {
  OrdersRepository,
  PaymentGatewaysRepository,
  SubscriptionsRepository,
  TemplatesRepository,
  TransactionsRepository,
} from '../../../repositories/sequelize';
import {getBaseClass} from '../utils/get-base-class';
import {SequelizePaymentApplication} from './sequelize.application';
let sequelizeApp: SequelizePaymentApplication;

const setup = async () => {
  sequelizeApp = new SequelizePaymentApplication({
    name: 'SequelizeApp',
  });
  await sequelizeApp.boot();
};

beforeEach(setup);

describe('Sequelize Component', () => {
  it('Uses the sequelize compatible repository in SubscriptionsController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SubscriptionsController,
        repository: SubscriptionsRepository,
        prop: 'subscriptionsRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });

  it('Uses the sequelize compatible repository in Orders controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: OrdersController,
        repository: OrdersRepository,
        prop: 'OrdersRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in TransactionSubscriptionsController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: TransactionSubscriptionsController,
        repository: TemplatesRepository,
        prop: 'templatesRepository',
      },
      {
        controller: TransactionSubscriptionsController,
        repository: SubscriptionsRepository,
        prop: 'subscriptionRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in Payment Gateways Controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: PaymentGatewaysController,
        repository: PaymentGatewaysRepository,
        prop: 'paymentGatewaysRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in Subscription Transactions Controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SubscriptionTransactionsController,
        repository: SubscriptionsRepository,
        prop: 'subscriptionRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in Transactions Controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: TransactionsController,
        repository: OrdersRepository,
        prop: 'ordersRepository',
      },
      {
        controller: TransactionsController,
        repository: TransactionsRepository,
        prop: 'transactionsRepository',
      },
      {
        controller: TransactionsController,
        repository: TemplatesRepository,
        prop: 'templatesRepository',
      },
      {
        controller: TransactionsController,
        repository: PaymentGatewaysRepository,
        prop: 'paymentGatewaysRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
});
describe('Component binds correct artifacts', () => {
  it('Does not contain classes extending DefaultCrudRepository', async () => {
    /**
     * Bound controller classes in `sequelizeApp` (rest app using sequelize component bound)
     */
    const boundRepositoryClasses = sequelizeApp
      .findByTag('repository')
      .map(e => e.source?.value);

    for (const repo of boundRepositoryClasses) {
      // No bound repository classes should extend `DefaultCrudRepository`
      expect(getBaseClass(repo)).to.not.be.eql(DefaultCrudRepository);
    }
  });
  it('Uses the sequelize compatible repository in Templates Controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: TemplatesController,
        repository: TemplatesRepository,
        prop: 'templatesRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
});
