import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { VideoPlayer } from '../Player.types';
import { AudioDelayView } from './controls/AudioDelayView';
import { ControlsBar } from './controls/Bar';
import useBackHandler from './controls/components/useBackHandler';
import useBrightness from './controls/components/useBrightness';
import { useTimeoutEffect } from './controls/components/useTimeoutEffect';
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
  const [showAudioDelay, setShowAudioDelay] = useState(false);

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

  const [_, setDelta] = useTimeoutEffect<number>(0, (delta: number) => {
    player.time = player.time + delta;
    setDelta(0, false);
  });

  const backward = () => {
    setDelta(delta => delta - 10000);
  };

  const forward = () => {
    setDelta(delta => delta + 30000);
  };

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
            onSingleTap={() => {
              if (!showTracks) {
                setShowControlsBar(!showControlsBar);
              }
              setShowTracks(false);
            }}
            onDoubleTapCenter={() => player.togglePlay()}
            onDoubleTapLeft={backward}
            onDoubleTapRight={forward}
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
              onBackward={backward}
              onForward={forward}
              leftButton={
                (player.audioTracks.length > 0 || player.textTracks.length > 1) && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setShowAudioDelay(false);
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
              centerLeftButton={
                !showAudioDelay && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setShowAudioDelay(true);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      borderRadius: 50,
                      backgroundColor: '#121212',
                      paddingVertical: 5,
                      paddingHorizontal: 10
                    }}
                  >
                    <MaterialIcons name="volume-up" size={25} color="white" />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '300' }}>{player.audioDelay} ms</Text>
                  </TouchableWithoutFeedback>
                )
              }
            />
          )}
          {showTracks && <TracksView player={player} onClose={() => setShowTracks(false)} />}
          {showAudioDelay && <AudioDelayView player={player} onClose={() => setShowAudioDelay(false)} />}
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
