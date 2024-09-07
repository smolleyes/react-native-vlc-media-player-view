import * as Brightness from 'expo-brightness';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useBrightness = (): [number | undefined, Dispatch<SetStateAction<number | undefined>>] => {
  const [brightness, setBrightness] = useState<number>();

  useEffect(() => {
    Brightness.getBrightnessAsync()
      .then(setBrightness)
      .then(() => Brightness.addBrightnessListener(event => setBrightness(event.brightness)));
  }, []);

  useEffect(() => {
    brightness !== undefined && Brightness.setBrightnessAsync(brightness);
  }, [brightness]);

  return [brightness, setBrightness];
};

export default useBrightness;
