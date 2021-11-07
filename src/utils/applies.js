export const organizeRows = (rows) => {
  rows.sort((a, b) => {
    //sort requests by row order.
    return a.rowNumber - b.rowNumber;
  });

  rows.forEach((row) => {
    //fix requests to start from row 1 and not from row 2.
    row.rowNumber--;
  });
  return rows;
};
