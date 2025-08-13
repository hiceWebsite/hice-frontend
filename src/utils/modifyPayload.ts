/* eslint-disable @typescript-eslint/no-explicit-any */
// export const modifyPayload = (payload: any) => {
//   const obj = { ...payload };
//   const file = obj["file"];
//   delete obj["file"];
//   const data = JSON.stringify(obj);
//   const formData = new FormData();
//   formData.append("data", data);
//   formData.append("file", file as Blob);

//   return formData;
// };

export const modifyPayload = (values: any) => {
  const { codeNumber, title, category, twoDFile, threeDFile } = values;
  const data = JSON.stringify({ codeNumber, title, category });
  const formData = new FormData();
  formData.append("data", data);
  if (twoDFile) formData.append("twoDFile", twoDFile as Blob);
  if (threeDFile) formData.append("threeDFile", threeDFile as Blob);
  return formData;
};
