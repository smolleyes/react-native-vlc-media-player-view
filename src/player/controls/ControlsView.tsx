import { FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

import { VideoInfo } from '../../model';
import { PressableIconView } from '../pressable/PressableIconView';
import { toTime } from '../utils/time.utils';
import { TracksView } from './TracksView';

type ControlsBarProps = ViewProps & {
  backUrl?: string;
  title?: string;
  paused?: boolean;
  progressBar: {
    time?: number;
    onSeekTo?: (time: number) => any;
  };
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onBackward?: () => void;
  onForward?: () => void;
  onNext?: () => void;
  videoInfo: VideoInfo | undefined;
  audioTrack?: number;
  textTrack?: number;
  onAudioTrackChange?: (id: number) => any;
  onTextTrackChange?: (id: number) => any;
};

export const ControlsView = ({
  backUrl,
  title,
  paused = true,
  progressBar,
  onTogglePlay,
  onBackward,
  onForward,
  onPrevious,
  onNext,
  style,
  videoInfo,
  audioTrack,
  textTrack,
  onAudioTrackChange,
  onTextTrackChange
}: ControlsBarProps) => {
  const [showTracks, setShowTracks] = useState(false);

  const buttonSize = 40;

  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.top}>
          {backUrl && (
            <PressableIconView href={backUrl} style={{ paddingLeft: 5, paddingTop: 3 }}>
              <Ionicons name="return-up-back" size={40} color="white" />
            </PressableIconView>
          )}
          {title && <Text style={{ maxWidth: '80%', maxHeight: 110 }}>{title}</Text>}
        </View>
        <View style={styles.center} />
        {(videoInfo?.seekable && progressBar.time && (
          <View style={styles.progressionBar}>
            <Text style={{ width: 70, textAlign: 'right' }}>{toTime(progressBar.time)}</Text>
            <Slider
              style={{ flexShrink: 1, flexGrow: 1 }}
              thumbTintColor="#ff8c00"
              minimumTrackTintColor="#ff8c00"
              maximumTrackTintColor="lightgray"
              value={progressBar.time || 0}
              onSlidingComplete={progressBar.onSeekTo}
              minimumValue={0}
              maximumValue={videoInfo.duration || 0}
            />
            <Text style={{ width: 70, textAlign: 'left' }}>{toTime(videoInfo.duration || 0)}</Text>
          </View>
        )) || <Text />}
        <View style={styles.bottom}>
          <View style={styles.part}>
            <PressableIconView onPress={() => setShowTracks(true)}>
              <MaterialIcons name="subtitles" size={buttonSize} color="white" />
            </PressableIconView>
          </View>
          <View style={styles.part}>
            {onPrevious && (
              <PressableIconView onPress={onPrevious}>
                <FontAwesome5 name="step-backward" size={buttonSize} color="white" />
              </PressableIconView>
            )}
          </View>
          <View style={styles.part}>
            {onBackward && (
              <PressableIconView onPress={onBackward}>
                <FontAwesome6 name="backward" size={buttonSize} color="white" />
              </PressableIconView>
            )}
          </View>
          <View style={styles.part}>
            {onTogglePlay && (
              <PressableIconView onPress={onTogglePlay} hasTVPreferredFocus>
                <MaterialIcons name={paused ? 'play-circle-outline' : 'pause-circle-outline'} size={buttonSize * 1.7} color="white" />
              </PressableIconView>
            )}
          </View>
          <View style={styles.part}>
            {onForward && (
              <PressableIconView onPress={onForward}>
                <FontAwesome6 name="forward" size={buttonSize} color="white" />
              </PressableIconView>
            )}
          </View>
          <View style={styles.part}>
            {onNext && (
              <PressableIconView onPress={onNext}>
                <FontAwesome5 name="step-forward" size={buttonSize} color="white" />
              </PressableIconView>
            )}
          </View>
          <View style={styles.part} />
        </View>
      </View>
      {showTracks && (
        <TracksView
          style={{ position: 'absolute' }}
          audioTrack={audioTrack}
          textTrack={textTrack}
          audioTracks={videoInfo?.audioTracks}
          textTracks={videoInfo?.textTracks}
          onAudioTrackChange={onAudioTrackChange}
          onTextTrackChange={onTextTrackChange}
          onClose={() => setShowTracks(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  top: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 40
  },
  center: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  progressionBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    height: 40
  },
  bottom: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  part: { flex: 1 }
});
