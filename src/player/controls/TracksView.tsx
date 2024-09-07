import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Track } from '../../model';
import { PressableView } from '../pressable/PressableView';

type TracksViewProps = {
  style: ViewStyle;
  audioTrack?: number;
  textTrack?: number;
  audioTracks?: Track[];
  textTracks?: Track[];
  onAudioTrackChange?: (id: number) => any;
  onTextTrackChange?: (id: number) => any;
  onClose?: () => void;
};

export const TracksView = ({
  style,
  audioTrack,
  textTrack,
  audioTracks,
  textTracks,
  onClose,
  onAudioTrackChange,
  onTextTrackChange
}: TracksViewProps) => {
  const selectedAudiotrack = audioTrack || 1;
  const selectedTextTrack = textTrack || -1;

  return (
    <View style={[styles.background, style]}>
      <View style={styles.container}>
        <View style={styles.parts}>
          <View style={styles.part}>
            <Text style={styles.separation}>Audio</Text>
            <ScrollView contentContainerStyle={styles.tracks}>
              {audioTracks?.map((track, index) => (
                <PressableView onPress={() => onAudioTrackChange && onAudioTrackChange(track.id)} style={styles.track}>
                  <View style={{ width: 24 }}>
                    {track.id === selectedAudiotrack && <Ionicons name="checkmark-sharp" size={24} color="white" />}
                  </View>
                  <Text key={'audio' + index} style={track.id !== selectedAudiotrack ? { opacity: 0.5 } : {}}>
                    {track.name}
                  </Text>
                </PressableView>
              ))}
            </ScrollView>
          </View>
          <View style={styles.part}>
            <Text style={styles.separation}>Sous-titre</Text>
            <ScrollView contentContainerStyle={styles.tracks}>
              {textTracks?.map((track, index) => (
                <PressableView onPress={() => onTextTrackChange && onTextTrackChange(track.id)} style={styles.track}>
                  <View style={{ width: 24 }}>
                    {track.id === selectedTextTrack && <Ionicons name="checkmark-sharp" size={24} color="white" />}
                  </View>
                  <Text key={'text' + index} style={track.id !== selectedTextTrack ? { opacity: 0.5 } : {}}>
                    {track.name}
                  </Text>
                </PressableView>
              ))}
            </ScrollView>
          </View>
        </View>
        {onClose && (
          <PressableView onPress={onClose} style={{ paddingBottom: 10, paddingRight: 20 }}>
            <Text>Fermer</Text>
          </PressableView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'black',
    width: '60%',
    height: '60%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  parts: {
    backgroundColor: 'black',
    padding: 20,
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20
  },
  part: {
    backgroundColor: 'black',
    opacity: 1,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    gap: 15
  },
  tracks: {
    backgroundColor: 'black',
    gap: 20
  },
  track: {
    flexDirection: 'row',
    gap: 20
  },
  separation: {
    backgroundColor: 'black',
    paddingBottom: 5,
    borderBottomColor: 'white',
    borderBottomWidth: 2
  }
});
