import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import FullScreenChz from 'react-native-fullscreen-chz';

const useFullscreenOrientation = () => {
  const [screenOrientation, setScreenOrientation] = useState<'landscape' | 'portrait'>('landscape');

  const defineScreenOrientation = (orientation: ScreenOrientation.Orientation) => {
    if (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
      setScreenOrientation('landscape');
    } else {
      setScreenOrientation('portrait');
    }
  };

  useEffect(() => {
    ScreenOrientation.getOrientationAsync()
      .then(defineScreenOrientation)
      .then(() => ScreenOrientation.addOrientationChangeListener(event => defineScreenOrientation(event.orientationInfo.orientation)));

    activateKeepAwakeAsync();

    return () => {
      deactivateKeepAwake();
      ScreenOrientation.unlockAsync();
      FullScreenChz.disable();
    };
  }, []);

  useEffect(() => {
    if (screenOrientation === 'landscape') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      FullScreenChz.enable();
    } else {
      ScreenOrientation.unlockAsync();
      FullScreenChz.disable();
    }
  }, [screenOrientation]);

  return [screenOrientation, setScreenOrientation];
};

export default useFullscreenOrientation;
