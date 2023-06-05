export const getRuntime = (
  creationTime: string | null | undefined,
  completionTime: string | null | undefined
): number => {
  if (!creationTime) {
    return 0;
  }
  const creationDate = new Date(creationTime);
  const completionDate = completionTime ? new Date(completionTime) : new Date();
  return completionDate.getTime() - creationDate.getTime();
};
