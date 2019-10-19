export const timeFormat = (t) => {
  const rawISO = t.toISOString();
  return rawISO.substring(0, rawISO.length - 5).replace('T', ' ');
};

