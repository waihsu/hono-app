export const generateRandomId = () =>
  (Math.random() + 1).toString(36).substring(7);
