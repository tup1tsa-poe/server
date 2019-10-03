export const validate = (possibleJson: string): boolean => {
  try {
    debugger;
    JSON.parse(possibleJson);
    return true;
  } catch (err) {
    return false;
  }
};
