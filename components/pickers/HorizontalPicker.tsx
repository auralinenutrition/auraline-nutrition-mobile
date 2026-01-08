import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useEffect, useRef } from "react";
import { colors, spacing, typography } from "@/theme";

type HorizontalPickerProps<T> = {
  data: T[];
  value: T;
  onChange: (value: T) => void;
  itemWidth?: number;
  renderLabel?: (item: T) => string;
};

const DEFAULT_ITEM_WIDTH = 72;

export function HorizontalPicker<T>({
  data,
  value,
  onChange,
  itemWidth = DEFAULT_ITEM_WIDTH,
  renderLabel = (item) => String(item),
}: HorizontalPickerProps<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = data.findIndex((i) => i === value);

  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollRef.current?.scrollTo({
        x: selectedIndex * itemWidth,
        animated: false,
      });
    }
  }, [selectedIndex, itemWidth]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / itemWidth);
    const item = data[index];
    if (item !== undefined) onChange(item);
  };

  return (
    <View style={styles.container}>
      {/* indicador central */}
      <View style={[styles.centerIndicator, { width: itemWidth }]} />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumEnd}
        contentContainerStyle={{
          paddingHorizontal: itemWidth * 2,
        }}
      >
        {data.map((item, idx) => {
          const selected = item === value;
          return (
            <View key={idx} style={[styles.item, { width: itemWidth }]}>
              <Text
                style={[
                  styles.text,
                  selected ? styles.textSelected : styles.textInactive,
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
    position: 'relative',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },

  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    ...typography.base,
  },

  textSelected: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  textInactive: {
    color: colors.textTertiary,
    opacity: 0.35,
  },

  centerIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.borderLight,
    opacity: 0.8,
    zIndex: 1,
  },
});

