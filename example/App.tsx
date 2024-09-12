import { useRef, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { ProgressInfo, useVideoPlayer, VideoInfo, VideoView } from 'react-native-vlc-media-player-view';

const VIDEO_SOURCE = 'http://apsmart.in/movie/545077210277743/1593574628/116852.mkv';

export default function App() {
  const player = useVideoPlayer(undefined /* { initOptions: ['--no-audio', '--quiet'] } */, player => {
    player.source = { uri: VIDEO_SOURCE };
    player.play();
  });
  const playerRef = useRef<VideoView>(null);

  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const [progress, setProgress] = useState<ProgressInfo>();
  const [paused, setPaused] = useState<boolean>();

  const seekPad = 60;

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <VideoView
        ref={playerRef}
        player={player}
        onLoaded={e => {
          console.log('loaded', e.nativeEvent);
          setVideoInfo(e.nativeEvent);
        }}
        onProgress={e => setProgress(e.nativeEvent)}
        onPaused={e => setPaused(e.nativeEvent.payload)}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          gap: 10,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: '#000',
          opacity: 0.8,
          padding: 10
        }}
      >
        {videoInfo?.seekable && <Button title="<<" onPress={() => (player.time = player.time - seekPad * 1000)} />}

        <Button title={paused ? 'play' : 'pause'} onPress={() => player.togglePlay()} />

        {videoInfo?.seekable && <Button title=">>" onPress={() => (player.time = player.time + seekPad * 1000)} />}

        <Text style={{ textAlignVertical: 'center', color: '#fff' }}>{toTime(progress?.time)}</Text>
        <Text style={{ textAlignVertical: 'center', color: '#fff' }}>
          {'=> '}
          {toTime(videoInfo?.duration)}
        </Text>
      </View>
    </View>
  );
}

const toTime = (timeInMillis?: number) => {
  if (timeInMillis && timeInMillis > 0) {
    const timeInSeconds = Math.floor(timeInMillis / 1000);
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${leftPad(hours, 2)}:${leftPad(minutes, 2)}:${leftPad(seconds, 2)}`;
  }
  return '';
};

const leftPad = (value?: number, pad = 2) => (value?.toFixed() || '').padStart(pad, '0');
