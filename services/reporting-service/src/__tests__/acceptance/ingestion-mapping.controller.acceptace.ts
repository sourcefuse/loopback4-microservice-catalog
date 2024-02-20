import {RestApplication} from '@loopback/rest';
import {Client, expect, sinon} from '@loopback/testlab';
import {IngestionMapping} from '../../models';
import {IngestionMappingsRepository} from '../../repositories';
import {IngestionMappingsService} from '../../services';
import {setUpApplication} from './helper';

describe('IngestionMappingsController', () => {
  let app: RestApplication;
  let client: Client;
  let ingestionMappingsService: IngestionMappingsService;
  let sandbox: sinon.SinonSandbox;
  let mockMapping: IngestionMapping;
  const INGESTION_MAP_URL = '/ingestion-mapping/testSource';
  before(async () => {
    ({app, client} = await setUpApplication());
    await givenRepositories();
    ingestionMappingsService = await app.get(
      'services.IngestionMappingsService',
    );
    sandbox = sinon.createSandbox();

    // Initialize mock data
    const mockMappingData: Partial<IngestionMapping> = {
      dataSourceName: 'testSource',
      recordType: 'testRecord',
      primaryColumn: 'testColumn',
      columnTransformations: {},
      permissions: {},
    };
    mockMapping = new IngestionMapping(mockMappingData);
    await ingestionMappingsService.create(mockMapping);
  });

  afterEach(() => sandbox.restore());
  after(async () => {
    await app.stop();
  });

  it('counts ingestion mappings', async () => {
    sandbox.stub(ingestionMappingsService, 'getCount').resolves({count: 1});
    await client
      .get('/ingestion-mapping/count')
      .expect(200)
      .expect(res => {
        expect(res.body).to.deepEqual({count: 1});
      });
  });

  it('creates an ingestion mapping', async () => {
    const mockMappingData2: Partial<IngestionMapping> = {
      dataSourceName: 'testSource2',
      recordType: 'testRecord2',
      primaryColumn: 'testColumn2',
      columnTransformations: {},
      permissions: {},
    };
    const mockMapping2 = new IngestionMapping(mockMappingData2);
    sandbox.stub(ingestionMappingsService, 'create').resolves(mockMapping2);
    await client
      .post('/ingestion-mapping')
      .send(mockMappingData2)
      .expect(200)
      .expect(res => {
        expect(res.body).to.deepEqual(mockMappingData2);
      });
  });

  it('retrieves all ingestion mappings', async () => {
    sandbox.stub(ingestionMappingsService, 'getAll').resolves([mockMapping]);
    await client
      .get('/ingestion-mapping')
      .expect(200)
      .expect(res => {
        const mappings: IngestionMapping[] = res.body;
        expect(Array.isArray(mappings)).to.be.true();
        expect(mappings.length).to.be.greaterThan(0);
        const foundMapping = mappings.some(
          map =>
            map.dataSourceName === 'testSource' &&
            map.recordType === 'testRecord' &&
            map.primaryColumn === 'testColumn',
        );
        expect(foundMapping).to.be.true();
      });
  });

  it('updates an ingestion mapping', async () => {
    const updatePayload = {primaryColumn: 'updatedColumn'};
    sandbox
      .stub(ingestionMappingsService, 'update')
      .withArgs('testSource', sinon.match(updatePayload))
      .resolves();

    await client.patch(INGESTION_MAP_URL).send(updatePayload).expect(204);
  });

  it('retrieves an ingestion mapping', async () => {
    const updatedMapping = {...mockMapping, primaryColumn: 'updatedColumn'};
    sandbox
      .stub(ingestionMappingsService, 'getByName')
      .resolves(updatedMapping);
    await client
      .get(INGESTION_MAP_URL)
      .expect(200)
      .expect(res => {
        expect(res.body.primaryColumn).to.equal('updatedColumn');
      });
  });

  it('deletes an ingestion mapping', async () => {
    sandbox.stub(ingestionMappingsService, 'deleteByName').resolves();
    await client.delete(INGESTION_MAP_URL).expect(204);
  });

  async function givenRepositories() {
    app
      .bind('repositories.IngestionMappingsRepository')
      .toClass(IngestionMappingsRepository);
    app
      .bind('services.IngestionMappingsService')
      .toClass(IngestionMappingsService);
  }
});
