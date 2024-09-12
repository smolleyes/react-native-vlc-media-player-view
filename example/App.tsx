import { useVideoPlayer, VideoView } from 'react-native-vlc-media-player-view';

export default function App() {
  const player = useVideoPlayer(undefined /* { initOptions: ['--no-audio', '--quiet'] } */, player => {
    player.source = { uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };
    player.play();
  });

  return <VideoView player={player} />;
}
