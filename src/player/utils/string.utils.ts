export const leftPad = (value?: number, pad = 2) => (value?.toFixed() || '').padStart(pad, '0');
