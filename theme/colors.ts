export const colors = {
  // 🌿 Cores primárias
  primary: '#00C758',
  primaryDark: '#00A544',
  primaryLight: '#E5F8ED',

  // ✍️ Texto
  textPrimary: '#121212',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // 🧱 Fundos
  white: '#FFFFFF',
  background: '#FAFAFA',
  backgroundSecondary: '#F9F9F9',
  backgroundTertiary: '#F5F5F5',

  // 📐 Bordas
  border: '#E0E0E0',
  borderLight: '#F0F0F0',

  // 🚦 Estados
  success: '#00C758',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',

  // 🌫 Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',

  // 🎯 Específico do quiz
  optionSelected: '#E5F8ED',
  optionBorder: '#E0E0E0',
} as const;

export type Colors = typeof colors;
