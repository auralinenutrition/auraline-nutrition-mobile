export const layout = {
  borderRadius: {
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },

  maxWidth: {
    card: 400,
    container: 1200,
  },

  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
  },
} as const;
