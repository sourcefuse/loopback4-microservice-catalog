// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {DeleteExportAuditLogsProvider} from '../../providers';

describe('Delete Export Log Service', () => {
  let deleteExportAuditLogsProvider: DeleteExportAuditLogsProvider;

  describe('Delete logs Service', () => {
    afterEach(() => sinon.restore());
    beforeEach(setUp);

    it('Provider returns a Function', async () => {
      const result = await deleteExportAuditLogsProvider.value();
      expect(result.deleteLogs).to.be.Function();
    });

    it('Provider throws a error if no target directory is provided', async () => {
      const deleteLogStatus = await deleteExportAuditLogsProvider.value();
      const targetDirectory = undefined;
      const result = deleteLogStatus.deleteLogs(targetDirectory);
      return expect(result).to.throwError;
    });

    function setUp() {
      deleteExportAuditLogsProvider = new DeleteExportAuditLogsProvider();
    }
  });
});
