import { Href, useRouter } from 'expo-router';
import { PropsWithChildren, useState } from 'react';
import { GestureResponderEvent, StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';

export type PressableViewProps = PropsWithChildren & {
  style?: ViewStyle;
  href?: string;
  focusedStyle?: StyleProp<ViewStyle>;
  onPress?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => void;
  hasTVPreferredFocus?: boolean;
};

export const PressableView = ({
  children,
  style,
  href,
  onPress,
  focusedStyle,
  hasTVPreferredFocus = false,
  ...props
}: PressableViewProps) => {
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  return (
    <View style={[style, focused ? [styles.focused, focusedStyle] : undefined]} {...props}>
      <TouchableHighlight
        style={style}
        underlayColor="transparent"
        onPress={href ? () => router.navigate(href as Href<string>) : onPress}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        hasTVPreferredFocus={hasTVPreferredFocus}
      >
        <>{children}</>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  focused: {
    transform: [{ scale: 1.2 }],
    zIndex: 10
  }
});
