// import {format} from 'date-fns';

// export const convertToTitleCase = (text: string) => {
//   if (!text) return text;
//   const result = text.replace(/([A-Z])/g, ' $1');
//   return result.charAt(0).toUpperCase() + result.slice(1);
// };

// export const convertToDate = (input: string | number | Date, inputFormat = 'dd.MM.yyyy') => {
//   if (!input) return input;
//   return format(new Date(input), inputFormat);
// };

export const getValue = (obj: any, key: string): any => {
  return key
    .replace(/\[([^\]]+)]/g, ".$1")
    .split(".")
    .reduce(function (o: { [x: string]: any }, p: string | number) {
      return o?.[p] || "";
    }, obj);
};
