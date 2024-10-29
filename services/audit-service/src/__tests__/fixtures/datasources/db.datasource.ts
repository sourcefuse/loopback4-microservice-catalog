import {AnyObject, Connector, juggler, Options} from '@loopback/repository';
import {sinon} from '@loopback/testlab';
import {ModelBuilder} from 'loopback-datasource-juggler';
import IsolationLevel = juggler.IsolationLevel;
import Transaction = juggler.Transaction;

export type MemoryConnector = Connector & {
  executeStub: sinon.SinonStub;
  reset: Function;
  fromDb: Function;
  cache: AnyObject;
  ids: AnyObject;
  transaction: Transaction;
};

export class MemoryDatasource extends juggler.DataSource {
  constructor(settings?: Options, modelBuilder?: ModelBuilder);

  constructor(
    connectorModule: Connector,
    settings?: Options,
    modelBuilder?: ModelBuilder,
  ) {
    super(connectorModule, settings, modelBuilder);
    if (this.connector) {
      this.connector.execute = function (
        this: MemoryConnector,
        ...args: unknown[]
      ) {
        const onExecuted = args.pop() as Function;
        return onExecuted(null, this.executeStub(args));
      };
      this.connector.executeStub = sinon.stub();
      this.connector.reset = function (this: MemoryConnector) {
        Object.entries(this.cache).forEach(([mid]) => {
          this.cache[mid] = {};
          this.ids[mid] = 1;
        });
      }.bind(this.connector as MemoryConnector); // NOSONAR
    }
  }
  beginTransaction(options?: IsolationLevel | Options): Promise<Transaction> {
    if (this.connector) {
      this.connector.transaction = {
        commit: sinon.stub(),
        rollback: sinon.stub(),
        isActive: sinon.stub(),
      };
      return this.connector.transaction;
    }
    return super.beginTransaction(options);
  }
}

export const testDB = new MemoryDatasource({
  name: 'db',
  connector: 'memory',
});

export const connector = testDB.connector as MemoryConnector; // NOSONAR
