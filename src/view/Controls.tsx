import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { VideoPlayer } from '../Player.types';
import { ControlsBar } from './controls/Bar';
import useBrightness from './controls/components/useBrightness';
import useVolume from './controls/components/useVolume';
import { ControlsGestures } from './controls/Gestures';
import { TracksView } from './controls/TracksView';
import { VerticalControl } from './controls/VerticalControl';
import { VideoPlayerEventsObserver } from './InternalVideoView';

type ControlsProps = {
  player: VideoPlayer;
  playerObserver: VideoPlayerEventsObserver;
  onBack?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export const Controls = ({ player, playerObserver, onBack, onPrevious, onNext }: ControlsProps) => {
  const [showControlsBar, setShowControlsBar] = useState(false);

  const [volume, setVolume] = useVolume();
  const [showVolume, setShowVolume] = useState(false);

  const [brightness, setBrightness] = useBrightness();
  const [showBrightness, setShowBrightness] = useState(false);

  const [showTracks, setShowTracks] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ControlsGestures
        onSingleTap={() => setShowControlsBar(!showControlsBar)}
        onDoubleTapCenter={() => player.togglePlay()}
        onDoubleTapLeft={() => (player.time = player.time - 10)}
        onDoubleTapRight={() => (player.time = player.time + 30)}
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
      {showVolume && (
        <VerticalControl value={volume} title="volume" align="left" icon={<MaterialIcons name="volume-up" size={30} color="white" />} />
      )}
      {showBrightness && (
        <VerticalControl
          value={brightness}
          title="luminosité"
          align="right"
          icon={<MaterialIcons name="brightness-medium" size={30} color="white" />}
        />
      )}
      {showControlsBar && (
        <ControlsBar
          player={player}
          playerObserver={playerObserver}
          onBack={onBack}
          onPrevious={onPrevious}
          onNext={onNext}
          leftButton={
            (player.audioTracks.length > 0 || player.textTracks.length > 1) && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setShowControlsBar(false);
                  setShowTracks(true);
                }}
              >
                <MaterialIcons name="subtitles" size={30} color="white" />
              </TouchableWithoutFeedback>
            )
          }
          rightButton={
            <TouchableWithoutFeedback
              onPress={() => {
                setShowControlsBar(false);
                setShowTracks(true);
              }}
            >
              <MaterialIcons name="keyboard-control" size={30} color="white" />
            </TouchableWithoutFeedback>
          }
        />
      )}
      {showTracks && <TracksView player={player} onClose={() => setShowTracks(false)} />}
    </GestureHandlerRootView>
  );
};

const capped = (value: number) => Math.max(0, Math.min(1, value));

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%'
  }
});
