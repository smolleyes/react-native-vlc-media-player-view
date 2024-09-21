import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { VideoPlayer } from '../../Player.types';

type TracksViewProps = {
  player: VideoPlayer;
  onClose: () => void;
};

export const TracksView = ({ player, onClose }: TracksViewProps) => {
  return (
    <LinearGradient
      colors={['transparent', 'rgba(18, 18, 18, 0.8)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.parts}>
          <View style={styles.part}>
            <Text style={styles.separation}>Audio</Text>
            <ScrollView contentContainerStyle={styles.tracks}>
              {player.audioTracks.map((track, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    player.selectedAudioTrackId = track.id;
                    onClose();
                  }}
                  style={styles.track}
                >
                  <View style={styles.track}>
                    <View style={{ width: 24 }}>
                      {track.id === player.selectedAudioTrackId && <Ionicons name="checkmark-sharp" size={24} color="white" />}
                    </View>
                    <Text
                      key={'audio' + index}
                      style={[{ color: 'white' }, track.id !== player.selectedAudioTrackId ? { opacity: 0.5 } : {}]}
                    >
                      {track.name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          </View>
          <View style={styles.part}>
            <Text style={styles.separation}>Sous-titre</Text>
            <ScrollView contentContainerStyle={styles.tracks}>
              {player.audioTracks.map((track, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    player.selectedTextTrackId = track.id;
                    onClose();
                  }}
                  style={styles.track}
                >
                  <View style={styles.track}>
                    <View style={{ width: 24 }}>
                      {track.id === player.selectedTextTrackId && <Ionicons name="checkmark-sharp" size={24} color="white" />}
                    </View>
                    <Text
                      key={'text' + index}
                      style={[{ color: 'white' }, track.id !== player.selectedTextTrackId ? { opacity: 0.5 } : {}]}
                    >
                      {track.name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose} style={{ paddingBottom: 10, paddingRight: 20 }}>
          <Text style={{ color: 'white', paddingHorizontal: 30, paddingVertical: 20, paddingTop: 0 }}>Fermer</Text>
        </TouchableWithoutFeedback>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    maxWidth: 500,
    minHeight: 212,
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  parts: {
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
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    gap: 15
  },
  tracks: {
    gap: 20
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 20
  },
  separation: {
    color: 'white',
    paddingBottom: 5,
    borderBottomColor: 'white',
    borderBottomWidth: 2
  }
});
