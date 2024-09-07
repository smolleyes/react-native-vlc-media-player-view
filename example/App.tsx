import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { PlayerRef, VlcPlayer } from 'react-native-vlc-media-player-view';

export default function App() {
  const mp4 = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const mkv = 'http://apsmart.in/movie/545077210277743/1593574628/123115.mkv';
  const direct = 'http://apsmart.in/545077210277743/1593574628/7809';

  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.play();
    }
  }, [playerRef.current]);

  return <VlcPlayer ref={playerRef} source={{ uri: direct, autoplay: false }} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
    // backgroundColor: 'black',
    // alignItems: 'center',
    // justifyContent: 'center'
  }
});
