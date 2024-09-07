import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { VolumeManager } from 'react-native-volume-manager';

const useVolume = (): [number | undefined, Dispatch<SetStateAction<number | undefined>>] => {
  const [volume, setVolume] = useState<number>();

  useEffect(() => {
    VolumeManager.getVolume()
      .then(event => setVolume(event.volume))
      .then(() => VolumeManager.addVolumeListener(event => setVolume(event.volume)));
  }, []);

  useEffect(() => {
    volume !== undefined && VolumeManager.setVolume(volume);
  }, [volume]);

  return [volume, setVolume];
};

export default useVolume;
