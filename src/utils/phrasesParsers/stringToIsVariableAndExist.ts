import { isVariableAndExist } from "./types";

export const stringToIsVariableAndExist = (
  text: string,
  data: any
): isVariableAndExist[] => {
  const result: isVariableAndExist[] = [];
  // const isVariableRegex = /([^({\s]+\.[^})\s]+)/g;
  const isVariableRegex = /([^({\s]+[A-Za-z]\.[^})\s]+)/g;
  // separe the matches and non matches into an array of objects:
  text.split(isVariableRegex).forEach((part) => {
    const isThereAMatchWithRegex = part.match(isVariableRegex)?.length;
    let isVariable = false,
      exist = false;
    if (isThereAMatchWithRegex) {
      isVariable = true;
      exist = checkIfPathExists(data, part);
    }

    result.push({
      value: part,
      isVariable,
      exist,
    });
  });
  return result;
};

// function that checks if a path exists in an object
function checkIfPathExists(obj: any, path: string) {
  return path
    .trim()
    .split(".")
    .every(function (key) {
      if (obj) {
        const objProps = obj["properties"];
        if (objProps) {
          obj = objProps;
        }
        obj = obj[key];
      }
      return obj;
    });
}
