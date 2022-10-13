// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
const execute = async () => {
  // dummy function
};

export const transactionStub = {
  commit(): Promise<void> {
    return execute();
  },
  rollback(): Promise<void> {
    return execute();
  },
  isActive(): boolean {
    return true;
  },
  id: 'sample-id',
};
