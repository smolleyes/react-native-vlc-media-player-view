import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressInfo, VideoInfo, VideoPlayer } from '../../Player.types';
import { VideoPlayerEventsObserver, VideoPlayerListener } from '../InternalVideoView';

type ControlsBarProps = {
  player: VideoPlayer;
  playerObserver: VideoPlayerEventsObserver;
  onBack?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  leftButton?: ReactNode;
  rightButton?: ReactNode;
};

const buttonSize = 40;

export const ControlsBar = ({ player, playerObserver, onBack, onPrevious, onNext, leftButton, rightButton }: ControlsBarProps) => {
  const title = player.title;

  const [paused, setPaused] = useState(player.paused);
  const [progress, setProgress] = useState<ProgressInfo>();
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();

  useEffect(() => {
    const listener: VideoPlayerListener = {
      onPaused: setPaused,
      onProgress: setProgress,
      onLoaded: setVideoInfo
    };
    playerObserver.addEventListener(listener);

    return () => {
      playerObserver.removeEventListener(listener);
    };
  }, []);

  return (
    <>
      <View style={styles.container}>
        <LinearGradient colors={['rgba(18, 18, 18, 0.8)', 'transparent']} style={styles.top}>
          {onBack && (
            <TouchableWithoutFeedback onPress={onBack}>
              <MaterialIcons name="arrow-back" size={40} color="white" />
            </TouchableWithoutFeedback>
          )}
          {title && (
            <Text
              style={{
                flex: 1,
                maxHeight: 110,
                fontSize: 32,
                fontWeight: 'bold',
                lineHeight: 60,
                color: 'white'
              }}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
        <View style={styles.center}></View>
        <LinearGradient colors={['transparent', 'rgba(18, 18, 18, 0.9)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.9 }}>
          {(videoInfo?.seekable && (
            <View style={styles.progressionBar}>
              <Text style={{ width: 70, textAlign: 'right', color: 'white' }}>{toTime(progress?.time)}</Text>
              <Slider
                style={{ flexShrink: 1, flexGrow: 1 }}
                thumbTintColor="#ff8c00"
                minimumTrackTintColor="#ff8c00"
                maximumTrackTintColor="lightgray"
                value={progress?.time || 0}
                onSlidingComplete={time => (player.time = time)}
                minimumValue={0}
                maximumValue={videoInfo.duration || 0}
              />
              <Text style={{ width: 70, textAlign: 'left', color: 'white' }}>{toTime(videoInfo.duration || 0)}</Text>
            </View>
          )) || <Text>{''}</Text>}
          <View style={styles.bottom}>
            <View style={styles.part}>{leftButton}</View>
            <View style={styles.progressControls}>
              <View style={styles.part}>
                {onPrevious && (
                  <TouchableWithoutFeedback onPress={onPrevious}>
                    <MaterialIcons name="first-page" size={buttonSize} color="white" />
                  </TouchableWithoutFeedback>
                )}
              </View>
              <View style={styles.part}>
                <TouchableWithoutFeedback onPress={() => (player.time = player.time - 10 * 1000)}>
                  <MaterialIcons name="replay-10" size={buttonSize} color="white" />
                </TouchableWithoutFeedback>
              </View>
              <View style={[styles.part, { width: buttonSize * 1.4 }]}>
                <TouchableWithoutFeedback onPress={() => player.togglePlay()}>
                  <MaterialIcons name={paused ? 'play-circle-outline' : 'pause-circle-outline'} size={buttonSize * 1.4} color="white" />
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.part}>
                <TouchableWithoutFeedback onPress={() => (player.time = player.time + 30 * 1000)}>
                  <MaterialIcons name="forward-30" size={buttonSize} color="white" />
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.part}>
                {onNext && (
                  <TouchableWithoutFeedback onPress={onNext}>
                    <MaterialIcons name="last-page" size={buttonSize} color="white" />
                  </TouchableWithoutFeedback>
                )}
              </View>
            </View>
            <View style={styles.part}>{rightButton}</View>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  top: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20
  },
  center: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  progressionBar: {
    zIndex: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    height: 40
  },
  bottom: {
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  progressControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  part: {
    zIndex: 10,
    width: buttonSize
  }
});

const toTime = (timeInMillis: number | undefined) => {
  if (timeInMillis !== undefined) {
    const timeInSeconds = Math.floor(timeInMillis / 1000);
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${leftPad(hours, 2)}:${leftPad(minutes, 2)}:${leftPad(seconds, 2)}`;
  }
  return '';
};

const leftPad = (value?: number, pad = 2) => (value?.toFixed() || '').padStart(pad, '0');
