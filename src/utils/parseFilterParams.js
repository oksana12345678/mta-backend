const parseType = (contactType) => {
  if (typeof contactType !== 'string') {
    return undefined;
  }

  const allowedTypes = ['work', 'home', 'personal'];
  return allowedTypes.includes(contactType) ? contactType : undefined;
};

const parseIsFavourite = (isFavourite) => {
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
  return undefined;
};
const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};

export default parseFilterParams;
