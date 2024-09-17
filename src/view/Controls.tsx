import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { VideoPlayer } from '../Player.types';
import { ControlsBar } from './controls/Bar';
import useBackHandler from './controls/components/useBackHandler';
import useBrightness from './controls/components/useBrightness';
import useVolume from './controls/components/useVolume';
import { ControlsGestures } from './controls/Gestures';
import { TracksView } from './controls/TracksView';
import { VerticalControl } from './controls/VerticalControl';
import { VideoPlayerEventsObserver, VideoPlayerListener } from './InternalVideoView';

type ControlsProps = {
  player: VideoPlayer;
  playerObserver: VideoPlayerEventsObserver;
  onBack?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export const Controls = ({ player, playerObserver, onBack, onPrevious, onNext }: ControlsProps) => {
  const [showControlsBar, setShowControlsBar] = useState(false);

  const [loading, setLoading] = useState(false);

  const [volume, setVolume] = useVolume();
  const [showVolume, setShowVolume] = useState(false);

  const [brightness, setBrightness] = useBrightness();
  const [showBrightness, setShowBrightness] = useState(false);

  const [showTracks, setShowTracks] = useState(false);

  useBackHandler(() => {
    if (showControlsBar) {
      setShowControlsBar(false);
      return true;
    }
    return;
  });

  // useTVEventHandler(event => {
  //   if (!showControlsBar) {
  //     event.eventType === 'left' && onBackward && onBackward();
  //     event.eventType === 'right' && onForward && onForward();
  //     (event.eventType === 'down' || event.eventType === 'up') && setShowControlsBar(true);
  //   }
  // });

  useEffect(() => {
    const listener: VideoPlayerListener = {
      onLoading: () => setLoading(true),
      onLoaded: () => setLoading(false)
    };
    playerObserver.addEventListener(listener);

    return () => {
      playerObserver.removeEventListener(listener);
    };
  }, []);

  return (
    <View style={styles.container}>
      {(loading && (
        <View style={styles.loading}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            Chargement...
          </Text>
        </View>
      )) || (
        <>
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
        </>
      )}
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
  },
  loading: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  }
});
