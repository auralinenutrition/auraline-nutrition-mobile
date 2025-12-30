export const typography = {
  // Tamanhos de fonte
  xs: {
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 26,
  },
  xl: {
    fontSize: 24,
    lineHeight: 32,
  },
  xxl: {
    fontSize: 32,
    lineHeight: 40,
  },
  
  // Pesos de fonte
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export type Typography = typeof typography;
