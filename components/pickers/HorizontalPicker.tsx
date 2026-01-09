import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
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

/**
 * Distância das linhas em relação ao centro do item selecionado
 */
const LINE_OFFSET = 1;

/**
 * 🔥 Move SOMENTE as linhas na horizontal
 * (+ direita | - esquerda)
 */
const LINE_HORIZONTAL_OFFSET = 0;

export function HorizontalPicker<T>({
  data,
  value,
  onChange,
  itemWidth = DEFAULT_ITEM_WIDTH,
  renderLabel = (item) => String(item),
}: HorizontalPickerProps<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = data.findIndex((i) => i === value);

  const screenWidth = Dimensions.get("window").width;
  const centerX = screenWidth / 2;

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
      {/* 🔥 LINHA ESQUERDA */}
      <View
        pointerEvents="none"
        style={[
          styles.selectionLine,
          {
            left:
              centerX -
              itemWidth / 2 -
              LINE_OFFSET +
              LINE_HORIZONTAL_OFFSET,
          },
        ]}
      />

      {/* 🔥 LINHA DIREITA */}
      <View
        pointerEvents="none"
        style={[
          styles.selectionLine,
          {
            left:
              centerX +
              itemWidth / 2 +
              LINE_OFFSET +
              LINE_HORIZONTAL_OFFSET,
          },
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
          paddingHorizontal: screenWidth / 2 - itemWidth / 2,
        }}
      >
        {data.map((item, idx) => {
          const selected = item === value;

          return (
            <View key={idx} style={[styles.item, { width: itemWidth }]}>
              <Text
                style={[
                  styles.text,
                  selected
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

  selectionLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.textPrimary,
    opacity: 0.15,
    zIndex: 10,
  },
});
