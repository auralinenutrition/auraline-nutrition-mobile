import {
  View,
  Text,
  StyleSheet,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
} from "react-native";
import { useRef, useEffect } from "react";
import { colors, spacing, typography } from "@/theme";

type VerticalPickerProps<T> = {
  data: T[];
  value: T;
  onChange: (value: T) => void;
  itemHeight?: number;
  renderLabel?: (item: T) => string;
};

const DEFAULT_ITEM_HEIGHT = 48;

export function VerticalPicker<T>({
  data,
  value,
  onChange,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  renderLabel = (item) => String(item),
}: VerticalPickerProps<T>) {
  const listRef = useRef<FlatList>(null);

  const selectedIndex = data.findIndex((item) => item === value);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedIndex >= 0) {
      listRef.current?.scrollToOffset({
        offset: selectedIndex * itemHeight,
        animated: false,
      });
    }
  }, [selectedIndex, itemHeight]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    const selectedItem = data[index];

    if (selectedItem !== undefined) {
      onChange(selectedItem);
    }
  };

  return (
    <View style={[styles.container, { height: itemHeight * 5 }]}>
      {/* Máscara superior */}
      <View style={styles.fadeTop} />

      <Animated.FlatList
        ref={listRef}
        data={data}
        keyExtractor={(_, index) => String(index)}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: itemHeight * 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 3) * itemHeight,
            (index - 2) * itemHeight,
            (index - 1) * itemHeight,
            index * itemHeight,
            (index + 1) * itemHeight,
            (index + 2) * itemHeight,
            (index + 3) * itemHeight,
          ];

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.15, 0.35, 0.6, 1, 0.6, 0.35, 0.15],
            extrapolate: "clamp",
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.82, 0.88, 0.94, 1, 0.94, 0.88, 0.82],
            extrapolate: "clamp",
          });

          const translateY = scrollY.interpolate({
            inputRange,
            outputRange: [18, 10, 4, 0, -4, -10, -18],
            extrapolate: "clamp",
          });

          const isSelected = item === value;

          return (
            <Animated.View
              style={[
                styles.item,
                {
                  height: itemHeight,
                  opacity,
                  transform: [{ scale }, { translateY }],
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  isSelected ? styles.textSelected : styles.textInactive,
                ]}
              >
                {renderLabel(item)}
              </Text>
            </Animated.View>
          );
        }}
      />

      {/* Máscara inferior */}
      <View style={styles.fadeBottom} />

      {/* Indicador central */}
      <View
        pointerEvents="none"
        style={[
          styles.selectionIndicator,
          {
            top: itemHeight * 2,
            height: itemHeight,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
  },

  item: {
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    ...typography.base,
  },

  textSelected: {
    color: colors.textPrimary,
    fontWeight: "500",
    fontSize: 20,
  },

  textInactive: {
    color: colors.textTertiary,
    opacity: 0.35,
  },

  selectionIndicator: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },

  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: colors.background,
    opacity: 0.96,
    zIndex: 1,
  },

  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: colors.background,
    opacity: 0.96,
    zIndex: 1,
  },
});
