export const getResourceName = ({
  namespace,
  environment,
  randomName,
}: {
  namespace: string;
  environment: string;
  randomName: string;
}) => `${namespace}-${environment}-${randomName}`;
