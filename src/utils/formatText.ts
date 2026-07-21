// import type { Suffix } from "../types/global";
export const formatTitle = (str = '') => {
  return `${str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}`
}


export const formatName = (fn?: string, ln?: string) => {
  return `${formatTitle(fn)} ${formatTitle(ln)}`
}
