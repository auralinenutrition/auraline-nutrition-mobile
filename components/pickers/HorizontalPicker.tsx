import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { colors, spacing, typography } from "@/theme";

type HorizontalPickerProps<T> = {
  data: T[];
  value: T;
  onChange: (value: T) => void;
  itemWidth?: number;
  renderLabel?: (item: T) => string;
};

const DEFAULT_ITEM_WIDTH = 72;
const VISIBLE_ITEMS = 5;
const CENTER_OFFSET = Math.floor(VISIBLE_ITEMS / 2);

export function HorizontalPicker<T>({
  data,
  value,
  onChange,
  itemWidth = DEFAULT_ITEM_WIDTH,
  renderLabel = (item) => String(item),
}: HorizontalPickerProps<T>) {
  const scrollRef = useRef<ScrollView>(null);

  const selectedIndex = data.findIndex((item) => item === value);

  /**
   * 🔥 REPOSICIONA SEMPRE QUE A TELA VOLTA AO FOCO
   */
  useFocusEffect(
    useCallback(() => {
      if (selectedIndex >= 0) {
        const offset = (selectedIndex - CENTER_OFFSET) * itemWidth;

        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({
            x: Math.max(0, offset),
            animated: false,
          });
        });
      }
    }, [selectedIndex, itemWidth])
  );

  const onMomentumEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index =
      Math.round(offsetX / itemWidth) + CENTER_OFFSET;

    const selectedItem = data[index];
    if (selectedItem !== undefined) {
      onChange(selectedItem);
    }
  };

  return (
    <View style={styles.container}>
      {/* Indicador central */}
      <View
        pointerEvents="none"
        style={[
          styles.centerIndicator,
          { width: itemWidth },
        ]}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        contentContainerStyle={{
          paddingHorizontal: itemWidth * CENTER_OFFSET,
        }}
      >
        {data.map((item, index) => {
          const isSelected = item === value;

          return (
            <View key={index} style={[styles.item, { width: itemWidth }]}>
              <Text
                style={[
                  styles.text,
                  isSelected
                    ? styles.textSelected
                    : styles.textInactive,
                ]}
              >
                {renderLabel(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...typography.base,
  },
  textSelected: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  textInactive: {
    color: colors.textTertiary,
    opacity: 0.35,
  },
  centerIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.borderLight,
    opacity: 0.8,
    zIndex: 1,
  },
});
