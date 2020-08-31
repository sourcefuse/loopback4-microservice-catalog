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
