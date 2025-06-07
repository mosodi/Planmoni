# Planmoni - Financial Planning App

A modern React Native financial planning application built with Expo Router and Supabase.

## Features

- **Wallet Management**: Track available and locked balances
- **Payout Planning**: Create and manage automated payout schedules
- **Authentication**: Secure user authentication with Supabase
- **Theme Support**: Light/dark mode with system preference detection
- **Responsive Design**: Optimized for mobile and web platforms

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router 4.0.17
- **Backend**: Supabase (Database, Auth, Real-time)
- **Styling**: StyleSheet with theme system
- **Icons**: Lucide React Native
- **Fonts**: Expo Google Fonts (Inter)

## Project Structure

```
app/
├── _layout.tsx              # Root layout
├── index.tsx               # Welcome screen
├── (auth)/                 # Authentication screens
├── (tabs)/                 # Main tab navigation
│   ├── index.tsx          # Home dashboard
│   └── settings.tsx       # Settings screen
└── create-payout/         # Payout creation flow

components/
├── index.ts               # Component exports
├── BaseScreen.tsx         # Base screen wrapper
├── Button.tsx             # Reusable button component
├── Card.tsx               # Card container component
├── Header.tsx             # Navigation header
├── InitialsAvatar.tsx     # User avatar component
├── Modal.tsx              # Base modal component
├── SettingsModal.tsx      # Settings modal variants
└── StatusTag.tsx          # Status indicator component

hooks/
├── index.ts               # Hook exports
├── useSupabaseAuth.ts     # Authentication logic
├── useWallet.ts           # Wallet management
├── usePayoutPlans.ts      # Payout plan operations
└── useBankAccounts.ts     # Bank account management

contexts/
├── AuthContext.tsx        # Authentication state
├── BalanceContext.tsx     # Wallet balance state
└── ThemeContext.tsx       # Theme management

utils/
├── index.ts               # Utility exports
└── formatters.ts          # Formatting functions
```

## Key Optimizations

This codebase has been optimized for minimal token usage while maintaining full functionality:

- **Centralized Exports**: All components, hooks, and utilities use index files
- **Shared Components**: Reusable BaseScreen, Header, and Modal components
- **Consolidated Styling**: Theme-aware styling system with shared constants
- **Reduced Redundancy**: Eliminated duplicate code across screens
- **Modular Architecture**: Clean separation of concerns

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create `.env` file with Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   Run Supabase migrations to set up the database schema.

4. **Start Development**
   ```bash
   npm run dev
   ```

## Database Schema

The app uses Supabase with the following main tables:
- `profiles` - User profile information
- `wallets` - User wallet balances
- `bank_accounts` - Linked bank accounts
- `payout_plans` - Automated payout schedules
- `transactions` - Transaction history
- `events` - User notifications

## Contributing

This is a production-ready financial planning application with a focus on clean architecture and maintainable code.