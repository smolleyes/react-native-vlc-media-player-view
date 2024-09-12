import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { VideoPlayer } from '../Player.types';
import { VideoInfo } from '../VideoView.types';
import { ControlsBar } from './controls/Bar';
import useBrightness from './controls/components/useBrightness';
import useVolume from './controls/components/useVolume';
import { ControlsGestures } from './controls/Gestures';
import { VerticalControl } from './controls/VerticalControl';

type ControlsProps = {
  player: VideoPlayer;
  videoInfo?: VideoInfo;
};

const SEEK_PAD = 15 * 1000;

export const Controls = ({ player, videoInfo }: ControlsProps) => {
  const [showControlsBar, setShowControlsBar] = useState(false);

  const [volume, setVolume] = useVolume();
  const [showVolume, setShowVolume] = useState(false);

  const [brightness, setBrightness] = useBrightness();
  const [showBrightness, setShowBrightness] = useState(false);

  return (
    <View style={styles.container}>
      <ControlsGestures
        onSingleTap={() => setShowControlsBar(!showControlsBar)}
        onDoubleTapCenter={() => player.togglePlay()}
        onDoubleTapLeft={() => (player.time = player.time - SEEK_PAD)}
        onDoubleTapRight={() => (player.time = player.time + SEEK_PAD)}
        onVerticalSlideLeft={delta => {
          setShowControlsBar(false);
          setShowBrightness(true);
          setBrightness(capped(brightness + delta));
        }}
        onVerticalSlideLeftEnd={() => setShowBrightness(false)}
        onVerticalSlideRight={delta => {
          setShowControlsBar(false);
          setShowVolume(true);
          setVolume(capped(volume + delta));
        }}
        onVerticalSlideRightEnd={() => setShowVolume(false)}
      />
      {showVolume && <VerticalControl value={volume} title="volume" align="left" />}
      {showBrightness && <VerticalControl value={brightness} title="luminosité" align="right" />}
      {showControlsBar && <ControlsBar player={player} videoInfo={videoInfo} />}
    </View>
  );
};

const capped = (value: number) => Math.max(0, Math.min(1, value));

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
