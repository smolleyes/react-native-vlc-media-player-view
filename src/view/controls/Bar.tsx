import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ReactNode, useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressInfo, VideoInfo, VideoPlayer } from '../../Player.types';
import { VideoPlayerEventsObserver, VideoPlayerListener } from '../InternalVideoView';

type ControlsBarProps = {
  player: VideoPlayer;
  playerObserver: VideoPlayerEventsObserver;
  onBack?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onBackward?: () => void;
  onForward?: () => void;
  centerLeftButton?: ReactNode;
  leftButton?: ReactNode;
  rightButton?: ReactNode;
};

const buttonSize = 40;

export const ControlsBar = ({
  player,
  playerObserver,
  onBack,
  onPrevious,
  onNext,
  onBackward,
  onForward,
  leftButton,
  rightButton,
  centerLeftButton
}: ControlsBarProps) => {
  const title = player.title;

  const [paused, setPaused] = useState(player.paused);
  const [progress, setProgress] = useState<ProgressInfo>();
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const [layout, setLayout] = useState<LayoutRectangle>();

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
    <View style={styles.container} onLayout={e => setLayout(e.nativeEvent.layout)}>
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
              fontWeight: '100',
              lineHeight: 60,
              color: 'white'
            }}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
      <View style={styles.center}>
        <View style={{ height: '100%', paddingTop: 20 }}>{centerLeftButton}</View>
      </View>
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
        <View style={[styles.bottom, layout?.width && layout.width < 400 ? { paddingHorizontal: 5 } : {}]}>
          <View style={styles.part}>{leftButton}</View>
          <View style={[styles.progressControls, layout?.width && layout.width < 400 ? { gap: 0 } : {}]}>
            <View style={styles.part}>
              {onPrevious && (
                <TouchableWithoutFeedback onPress={onPrevious}>
                  <MaterialIcons name="first-page" size={buttonSize} color="white" />
                </TouchableWithoutFeedback>
              )}
            </View>
            <View style={styles.part}>
              <TouchableWithoutFeedback onPress={onBackward}>
                <MaterialIcons name="replay-10" size={buttonSize} color="white" />
              </TouchableWithoutFeedback>
            </View>
            <View style={[styles.part, { width: buttonSize * 1.4 }]}>
              <TouchableWithoutFeedback onPress={() => player.togglePlay()}>
                <MaterialIcons name={paused ? 'play-circle-outline' : 'pause-circle-outline'} size={buttonSize * 1.4} color="white" />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.part}>
              <TouchableWithoutFeedback onPress={onForward}>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
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
    gap: 20
  },
  progressControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  part: {
    width: buttonSize,
    justifyContent: 'center',
    alignItems: 'center'
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
