import { StyleSheet, View } from 'react-native';
import VerticalSlider from './components/VerticalSlider';

type VerticalControlProps = {
  value: number;
  title: string;
  align: 'left' | 'right';
};

export const VerticalControl = ({ value, title, align }: VerticalControlProps) => {
  return (
    <View style={[styles.container, { alignItems: align === 'left' ? 'flex-start' : 'flex-end' }]}>
      <VerticalSlider containerStyle={{ height: '60%', maxHeight: 300 }} value={value} label={title} labelPosition="right" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
