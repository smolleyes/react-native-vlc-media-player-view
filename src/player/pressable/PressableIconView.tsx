import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { PressableView, PressableViewProps } from './PressableView';

export const PressableIconView = ({
  children,
  text,
  hasTVPreferredFocus = false,
  ...props
}: PressableViewProps & { text?: string; style?: StyleProp<ViewStyle> | undefined }) => {
  return (
    <View style={[styles.action, props.style]}>
      <PressableView focusedStyle={{ transform: [{ scale: 1.5 }] }} {...props}>
        {children}
      </PressableView>
      {text && <Text>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  }
});
