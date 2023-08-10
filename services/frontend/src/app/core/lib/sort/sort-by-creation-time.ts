interface HasCreationTime {
  creationTime?: string | null | undefined;
}

export const sortByCreationTime = (
  objA: HasCreationTime,
  objB: HasCreationTime
): number => {
  const date1 = new Date(objA.creationTime || 0);
  const date2 = new Date(objB.creationTime || 0);
  return date2.getTime() - date1.getTime();
};
