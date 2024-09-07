import { useState } from 'react';
import { StyleSheet, useTVEventHandler, /* useTVEventHandler,  */ View } from 'react-native';

import { VideoInfo } from '../model';
import { ControlsView } from './controls/ControlsView';
import { PlayerGestures } from './controls/Gestures';
import useBackHandler from './hooks/useBackHandler';
import { PressableView } from './pressable/PressableView';

type ControlsProps = {
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

export const Controls = ({
  backUrl,
  title,
  paused = true,
  progressBar,
  onTogglePlay,
  onBackward,
  onForward,
  onPrevious,
  onNext,
  videoInfo,
  audioTrack,
  textTrack,
  onAudioTrackChange,
  onTextTrackChange
}: ControlsProps) => {
  const [showControlsBar, setShowControlsBar] = useState(false);

  useBackHandler(() => {
    if (showControlsBar) {
      setShowControlsBar(false);
      return true;
    }
    return null;
  });

  useTVEventHandler(event => {
    if (!showControlsBar) {
      event.eventType === 'left' && onBackward && onBackward();
      event.eventType === 'right' && onForward && onForward();
      (event.eventType === 'down' || event.eventType === 'up') && setShowControlsBar(true);
    }
  });

  return (
    <View style={styles.controls}>
      {!showControlsBar && <PressableView onPress={() => setShowControlsBar(true)} style={styles.controls} />}
      <PlayerGestures
        style={{ position: 'absolute' }}
        onToggleShowControls={() => setShowControlsBar(!showControlsBar)}
        onTogglePlay={onTogglePlay}
        onBackward={onBackward}
        onForward={onForward}
        onPriorGesture={() => setShowControlsBar(false)}
      />
      {showControlsBar && (
        <ControlsView
          style={{ position: 'absolute', padding: 10 }}
          backUrl={backUrl}
          title={title}
          paused={paused}
          onTogglePlay={onTogglePlay}
          onBackward={onBackward}
          onForward={onForward}
          onPrevious={onPrevious}
          onNext={onNext}
          progressBar={progressBar}
          videoInfo={videoInfo}
          audioTrack={audioTrack}
          textTrack={textTrack}
          onAudioTrackChange={onAudioTrackChange}
          onTextTrackChange={onTextTrackChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
});
