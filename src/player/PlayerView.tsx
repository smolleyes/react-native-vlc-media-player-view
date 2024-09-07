import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Href, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlayerViewProps, ProgressInfo, VideoInfo } from '../model';
import { Controls } from './Controls';
import { PlayerWrapper, PlayerWrapperRef } from './PlayerWrapper';
import useFullscreenOrientation from './hooks/useFullscreenOrientation';
import { PressableIconView } from './pressable/PressableIconView';

export const PlayerView = ({ source, position, backUrl, title, onTimeChanged, onPrevious, onNext, onEnd }: PlayerViewProps) => {
  const router = useRouter();
  const route = useRoute();

  const player = useRef<PlayerWrapperRef>(null);

  const [progress, setProgress] = useState<ProgressInfo>();
  const [paused, setPaused] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useFullscreenOrientation();

  return (
    <View style={styles.container}>
      {source?.uri && (
        <PlayerWrapper
          ref={player}
          source={source}
          position={position}
          onTimeChanged={onTimeChanged}
          onProgress={setProgress}
          onLoaded={(event: VideoInfo) => {
            setVideoInfo(event);
            setLoading(false);
          }}
          onPaused={setPaused}
          onError={() => setError(true)}
          onEnd={onEnd}
        />
      )}
      <Controls
        backUrl={backUrl}
        title={title}
        paused={paused}
        onTogglePlay={player.current?.togglePlay}
        onBackward={player.current?.backward}
        onForward={player.current?.forward}
        onPrevious={onPrevious}
        onNext={onNext}
        progressBar={{
          time: progress?.currentTime,
          onSeekTo: player.current?.seekTo
        }}
        videoInfo={videoInfo}
        audioTrack={player.current?.audioTrack}
        textTrack={player.current?.textTrack}
        onAudioTrackChange={player.current?.setAudioTrack}
        onTextTrackChange={player.current?.setTextTrack}
      />
      {loading && (
        <View style={[styles.container, { position: 'absolute', backgroundColor: 'transparent' }]}>
          <Text style={styles.text}>Loading...</Text>
        </View>
      )}
      {error && (
        <View style={[styles.container, { position: 'absolute' }]}>
          {backUrl && (
            <PressableIconView href={backUrl} style={{ position: 'absolute', top: 10, left: 10 }}>
              <Ionicons name="return-up-back" size={40} color="white" />
            </PressableIconView>
          )}
          <PressableIconView onPress={() => route.path && router.replace(route.path as Href<string>)}>
            <Ionicons name="refresh" size={40} color="white" />
          </PressableIconView>
          <Text style={styles.text}>Error loading video!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 60
  }
});
