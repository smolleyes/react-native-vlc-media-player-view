import { useEffect, useRef, useState } from 'react';
import { Button, View } from 'react-native';
import { ProgressInfo, useVideoPlayer, VideoInfo, VideoView } from 'react-native-vlc-media-player-view';

const VIDEO_SOURCE = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function App() {
  const player = useVideoPlayer(undefined /* { initOptions: ['--no-audio', '--quiet'] } */, player => {
    player.source = { uri: VIDEO_SOURCE };
    player.play();
  });
  const playerRef = useRef<VideoView>(null);

  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const [progress, setProgress] = useState<ProgressInfo>();

  useEffect(() => {
    console.log('progress', progress);
  }, [progress]);

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
      <VideoView ref={playerRef} player={player} onLoaded={e => setVideoInfo(e.nativeEvent)} onProgress={e => setProgress(e.nativeEvent)} />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {videoInfo?.seekable && <Button title="<<" onPress={() => Math.max(0, (player.time = player.time + 15 * 1000))} />}
        <Button title={player.isPlaying ? 'pause' : 'play'} onPress={() => player.togglePlay()} />
        {videoInfo?.seekable && <Button title=">>" onPress={() => Math.min(videoInfo.duration, (player.time = player.time + 15 * 1000))} />}
      </View>
    </View>
  );
}
