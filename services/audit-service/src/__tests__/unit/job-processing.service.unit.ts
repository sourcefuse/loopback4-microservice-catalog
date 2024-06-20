import {expect, sinon} from '@loopback/testlab';
import {FileStatusKey} from '../../enums/file-status-key.enum';
import {Job} from '../../models';
import {
  getTestJobProcessingService,
  givenEmptyTestDB,
  populateTestDB,
} from '../helpers/db.helper';
import {archive1, archive2} from '../sample-data/archive-log';
import {
  filterAppliedActedAt,
  filterAppliedActedOn,
  filterAppliedEntityId,
} from '../sample-data/filters';

describe('job processing service', () => {
  beforeEach(async () => {
    await givenEmptyTestDB();
    await populateTestDB();
  });
  it('query logs when date and actedOn is provided', async () => {
    const {jobProcessingService, querySelectedFilesProvider, jobRepository} =
      getTestJobProcessingService();
    const jobDummy: Job = new Job({
      status: FileStatusKey.PENDING,
      filterUsed: filterAppliedActedAt,
    });
    const jobId = (await jobRepository.create(jobDummy)).getId();
    const getFileContentStub = sinon.stub(
      querySelectedFilesProvider,
      'getFileContent',
    );
    //archive1 is the data that is supposed to be contained in archive1.csv
    getFileContentStub.withArgs('archive1.csv').resolves(archive1);
    //archive2 is the data that is supposed to be contained in archive2.csv
    getFileContentStub.withArgs('archive2.csv').resolves(archive2);

    await jobProcessingService.start(jobId);
    const result = JSON.parse((await jobRepository.findById(jobId)).result);
    const expectedIds = ['1', '4', '11', '14'];

    expect(result).to.be.containDeep(expectedIds.map(id => ({id})));
    sinon.assert.match(result.length, 4);
  });
  it('query logs when only actedOn is provided', async () => {
    const {jobProcessingService, querySelectedFilesProvider, jobRepository} =
      getTestJobProcessingService();
    const jobDummy: Job = new Job({
      status: FileStatusKey.PENDING,
      filterUsed: filterAppliedActedOn, //1 May to 08th May
    });
    const jobId = (await jobRepository.create(jobDummy)).getId();

    const getFileContentStub = sinon.stub(
      querySelectedFilesProvider,
      'getFileContent',
    );
    //archive1 is the data that is supposed to be contained in archive1.csv
    getFileContentStub.withArgs('archive1.csv').resolves(archive1);
    //archive2 is the data that is supposed to be contained in archive2.csv
    getFileContentStub.withArgs('archive2.csv').resolves(archive2);

    await jobProcessingService.start(jobId);
    const result = JSON.parse((await jobRepository.findById(jobId)).result);
    const expectedIds = ['1', '2', '3', '4', '5', '11', '12', '13', '14', '15'];

    expect(result).to.be.containDeep(expectedIds.map(id => ({id})));
    sinon.assert.match(result.length, 10);
  });
  it('query logs when only entityId is provided', async () => {
    const {jobProcessingService, querySelectedFilesProvider, jobRepository} =
      getTestJobProcessingService();
    const jobDummy: Job = new Job({
      status: FileStatusKey.PENDING,
      filterUsed: filterAppliedEntityId,
    });
    const jobId = (await jobRepository.create(jobDummy)).getId();

    const getFileContentStub = sinon.stub(
      querySelectedFilesProvider,
      'getFileContent',
    );
    //archive1 is the data that is supposed to be contained in archive1.csv
    getFileContentStub.withArgs('archive1.csv').resolves(archive1);
    //archive2 is the data that is supposed to be contained in archive2.csv
    getFileContentStub.withArgs('archive2.csv').resolves(archive2);

    await jobProcessingService.start(jobId);
    const result = JSON.parse((await jobRepository.findById(jobId)).result);
    const expectedIds = ['1', '2', '4', '5', '11', '12', '14', '15'];

    expect(result).to.be.containDeep(expectedIds.map(id => ({id})));
    sinon.assert.match(result.length, 8);
  });
  it('query logs when no filter is provided', async () => {
    const {jobProcessingService, querySelectedFilesProvider, jobRepository} =
      getTestJobProcessingService();
    const jobDummy: Job = new Job({
      status: FileStatusKey.PENDING,
      filterUsed: {},
    });
    const jobId = (await jobRepository.create(jobDummy)).getId();

    const getFileContentStub = sinon.stub(
      querySelectedFilesProvider,
      'getFileContent',
    );
    //archive1 is the data that is supposed to be contained in archive1.csv
    getFileContentStub.withArgs('archive1.csv').resolves(archive1);
    //archive2 is the data that is supposed to be contained in archive2.csv
    getFileContentStub.withArgs('archive2.csv').resolves(archive2);

    await jobProcessingService.start(jobId);
    const result = JSON.parse((await jobRepository.findById(jobId)).result);
    const expectedIds = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '11',
      '12',
      '13',
      '14',
      '15',
    ];

    expect(result).to.be.containDeep(expectedIds.map(id => ({id})));
    sinon.assert.match(result.length, 11);
  });
});
