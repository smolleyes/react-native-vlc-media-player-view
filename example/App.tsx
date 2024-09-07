import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { PlayerRef, VlcPlayer } from 'react-native-vlc-media-player-view';

export default function App() {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.seekTo(50 * 1000);
    }
  }, [playerRef.current]);

  return (
    <VlcPlayer
      ref={playerRef}
      source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
