export const getVariables = (text: string): string[] => {
  let result: string[] = [];
  const variablesRegex = /([^({\s]+\.[^})\s]+)/g;
  const variablesInArray = text.match(variablesRegex)
  variablesInArray.map((variable) => {
    result.push(variable);
  })
  return result;
}