import { MaterialIcons } from '@expo/vector-icons';
import { IconButtonProps } from '@expo/vector-icons/build/createIconSet';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Chapter, useVideoPlayer, VideoPlayer, VideoSource, VideoView } from 'react-native-vlc-media-player-view';

export default function App() {
  const [source, setSource] = useState<VideoSource>();

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: 20,
        padding: 10,
        backgroundColor: '#121212'
      }}
    >
      <View style={{ flex: 0, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
        <Text style={{ color: 'white' }}>Select a video: </Text>

        <Button
          title="mkv"
          onPress={() => setSource({ uri: 'http://apsmart.in/movie/545077210277743/1593574628/134615.mkv', time: 6 * 60 * 1000 })}
        />

        <Button title="serie" onPress={() => setSource({ uri: 'http://apsmart.in/series/545077210277743/1593574628/74747.mkv' })} />

        <Button
          title="avi"
          onPress={() => setSource({ uri: 'http://apsmart.in/movie/545077210277743/1593574628/63584.avi', time: 13 * 60 * 1000 })}
        />

        <Button
          title="mp4"
          onPress={() => setSource({ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' })}
        />

        <Button
          title="4K"
          onPress={() => setSource({ uri: 'https://videos.pexels.com/video-files/28237488/12335970_2560_1440_24fps.mp4' })}
        />

        <Button
          title="vertical"
          onPress={() => setSource({ uri: 'https://videos.pexels.com/video-files/27065199/12061858_1440_2560_60fps.mp4' })}
        />

        <Button title="close" onPress={() => setSource(undefined)} disabled={!source} />
      </View>
      {source && <Player source={source} onBack={() => setSource(undefined)} />}
    </GestureHandlerRootView>
  );
}

type PlayerProps = {
  onBack: (player: VideoPlayer) => void;
  source: VideoSource;
};

const Player = ({ onBack, source }: PlayerProps) => {
  const player = useVideoPlayer({}, player => {
    player.title = 'Size is adapted to parent layout';
  });

  player.play(source);

  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [intro, setIntro] = useState<Chapter>();

  return (
    <>
      <VideoView
        player={player}
        style={{ flex: 1, width: '80%', backgroundColor: '#121212' }}
        onLoaded={() => setIntro(player.chapters.find(c => c.name.match(/opening/i)))}
        onNext={() => console.log('next')}
        onPrevious={() => console.log('previous')}
        onBack={() => onBack(player)}
        onProgress={e => {
          const time = e.nativeEvent.time;
          const isInIntro = !!intro && time >= intro.timeOffset && time < intro.timeOffset + intro.duration - 1;
          setShowSkipIntro(isInIntro);
        }}
      />
      {intro && showSkipIntro && (
        <View style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}>
          <MaterialIcons.Button name="skip-next" size={20} onPress={() => (player.time = intro.timeOffset + intro.duration)}>
            Skip Intro
          </MaterialIcons.Button>
        </View>
      )}
    </>
  );
};

type ButtonProps = Omit<IconButtonProps<string>, 'name'> & {
  title: string;
};

const Button = ({ title, ...props }: ButtonProps) => {
  return (
    <MaterialIcons.Button name="play-circle-filled" size={20} {...props}>
      {title}
    </MaterialIcons.Button>
  );
};
