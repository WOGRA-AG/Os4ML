export const getRuntime = (
  creationTime: string | undefined,
  completionTime: string | undefined
): number => {
  if (!creationTime) {
    return 0;
  }
  const creationDate = new Date(creationTime);
  const completionDate = completionTime ? new Date(completionTime) : new Date();
  return completionDate.getTime() - creationDate.getTime();
};
