// import type { Suffix } from "../types/global";
export const formatTitle = (str = '') => {
  return `${str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}`
}


export const formatName = (fn?: string, ln?: string) => {
  return `${formatTitle(fn)} ${formatTitle(ln)}`
}

export const formatShortTitle = (str: string) => {
  let newStr = formatTitle(str);

  if (newStr.length > 20) {
    newStr = `${str.slice(0, 20)}...`;
  }
  return newStr;
}
