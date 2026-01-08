import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRef, useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import { colors, typography } from "@/theme";

type VerticalPickerProps<T> = {
  data: T[];
  value: T;
  onChange: (value: T) => void;
  itemHeight?: number;
  renderLabel?: (item: T) => string;
};

const DEFAULT_ITEM_HEIGHT = 70;
const VISIBLE_ITEMS = 5;

/**
 * Índice lógico da seleção
 */
const SELECTION_INDEX = 1;

/**
 * Distância das linhas em relação ao centro do texto
 */
const LINE_OFFSET = 26;

/**
 * 🔥 CONTROLA SOMENTE a subida/descida das linhas
 * (+ desce | - sobe)
 */
const LINE_VERTICAL_OFFSET = 55;

export function VerticalPicker<T>({
  data,
  value,
  onChange,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  renderLabel = (item) => String(item),
}: VerticalPickerProps<T>) {
  const listRef = useRef<FlatList<T | null>>(null);

  const dataWithSpacers = useMemo<(T | null)[]>(() => {
    const spacers = Array(SELECTION_INDEX).fill(null);
    return [...spacers, ...data, ...spacers];
  }, [data]);

  const selectedIndex = data.findIndex((item) => item === value);
  const selectedIndexWithSpacers =
    selectedIndex >= 0 ? selectedIndex + SELECTION_INDEX : -1;

  useFocusEffect(
    useCallback(() => {
      if (selectedIndexWithSpacers >= 0) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex({
            index: selectedIndexWithSpacers,
            animated: false,
            viewPosition: SELECTION_INDEX / VISIBLE_ITEMS,
          });
        });
      }
    }, [selectedIndexWithSpacers])
  );

  return (
    <View style={[styles.container, { height: itemHeight * VISIBLE_ITEMS }]}>
      {/* 🔥 LINHA SUPERIOR */}
      <View
        pointerEvents="none"
        style={[
          styles.selectionLine,
          {
            top:
              itemHeight * SELECTION_INDEX +
              itemHeight / 2 -
              LINE_OFFSET +
              LINE_VERTICAL_OFFSET,
          },
        ]}
      />

      {/* 🔥 LINHA INFERIOR */}
      <View
        pointerEvents="none"
        style={[
          styles.selectionLine,
          {
            top:
              itemHeight * SELECTION_INDEX +
              itemHeight / 2 +
              LINE_OFFSET +
              LINE_VERTICAL_OFFSET,
          },
        ]}
      />

      <FlatList
        ref={listRef}
        data={dataWithSpacers}
        keyExtractor={(_, index) => String(index)}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingTop: itemHeight * SELECTION_INDEX,
          paddingBottom:
            itemHeight * (VISIBLE_ITEMS - SELECTION_INDEX - 1),
        }}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;

          const indexWithSpacers = Math.round(
            (offsetY + SELECTION_INDEX * itemHeight) / itemHeight
          );

          const dataIndex = indexWithSpacers - SELECTION_INDEX;
          const item = data[dataIndex];

          if (item !== undefined) {
            onChange(item);
          }
        }}
        renderItem={({ item }) => {
          if (item === null) {
            return <View style={{ height: itemHeight }} />;
          }

          const isSelected = item === value;

          return (
            <View style={[styles.item, { height: itemHeight }]}>
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
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...typography.base,
  },
  textSelected: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  textInactive: {
    color: colors.textTertiary,
    opacity: 0.35,
  },
  selectionLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.textPrimary,
    opacity: 0.15,
    zIndex: 10,
  },
});
