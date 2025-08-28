// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modifyUpdatePayload = (values: any) => {
  const formData = new FormData();

  const { codeNumber, title, category, twoDFile, threeDFile } = values;

  // only append fields that exist
  if (codeNumber) formData.append("data", JSON.stringify({ codeNumber }));
  if (title) formData.append("data", JSON.stringify({ title }));
  if (category) formData.append("data", JSON.stringify({ category }));
  if (twoDFile) formData.append("twoDFile", twoDFile as Blob);
  if (threeDFile) formData.append("threeDFile", threeDFile as Blob);

  return formData;
};
