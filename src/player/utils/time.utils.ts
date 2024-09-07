import { leftPad } from './string.utils';

export const toTime = (timeInMillis?: number) => {
  if (timeInMillis && timeInMillis > 0) {
    const timeInSeconds = Math.floor(timeInMillis / 1000);
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${leftPad(hours, 2)}:${leftPad(minutes, 2)}:${leftPad(seconds, 2)}`;
  }
  return '';
};
