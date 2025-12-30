# Auraline Nutrition Mobile

App mobile do Auraline Nutrition desenvolvido com Expo + React Native.

## 🚀 Tecnologias

- **Expo** (managed)
- **React Native**
- **TypeScript**
- **Expo Router** (navegação)
- **react-native-safe-area-context**
- **AsyncStorage** (persistência)
- **Zod** (validação)

## 📱 Estrutura do Projeto

```
app/
├─ (auth)/          # Autenticação
│  ├─ login.tsx
│  └─ register.tsx
├─ (onboarding)/    # Onboarding e Quiz
│  ├─ quiz.tsx
│  ├─ result.tsx
│  ├─ plans.tsx
│  └─ checkout.tsx
├─ (tabs)/          # Telas principais
│  ├─ home.tsx
│  ├─ progress.tsx
│  ├─ shopping.tsx
│  └─ profile.tsx
└─ _layout.tsx      # Layout raiz
```

## 🎯 Fluxo do App

1. **Landing** → Tela inicial com CTAs
2. **Quiz** → Onboarding em uma única tela
3. **Resultado** → Exibe resultado personalizado
4. **Planos** → Seleção de plano (Free/Premium/Vitalício)
5. **Checkout** → Mock de pagamento (Premium/Vitalício)
6. **Cadastro/Login** → Autenticação
7. **Home** → Tela principal do app

## ⚡ Instalação

```bash
npm install
```

## 🏃 Executar

```bash
# Desenvolvimento
npm start

# iOS
npm run ios

# Android
npm run android
```

## 📝 Notas

- RevenueCat desativado por padrão
- Todos os planos liberados em modo dev
- Quiz implementado em uma única tela
- Motivação via modal overlay
- Navegação fluida com Expo Router

