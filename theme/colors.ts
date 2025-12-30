export const colors = {
  // Cores primárias
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#5AC8FA',
  
  // Cores de texto
  text: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Cores de fundo
  white: '#ffffff',
  background: '#ffffff',
  backgroundSecondary: '#f9f9f9',
  backgroundTertiary: '#f5f5f5',
  
  // Cores de borda
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  
  // Cores de estado
  success: '#34C759',
  error: '#ff3b30',
  warning: '#FF9500',
  info: '#007AFF',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Cores específicas do quiz
  optionSelected: '#E3F2FD',
  optionBorder: '#e0e0e0',
} as const;

export type Colors = typeof colors;
