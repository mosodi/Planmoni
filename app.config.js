// app.config.js
export default {
  expo: {
    name: 'Planmoni',
    owner: "planmoni", // 👈 Add this line
    scheme: "myapp",
    // ... other config
    extra: {
      "eas": {
        "projectId": "05caad20-9b74-4ba8-8280-dc5939b7ca83"
      },
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
      EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      EXPO_PUBLIC_MONO_PUBLIC_KEY: process.env.EXPO_PUBLIC_MONO_PUBLIC_KEY || '',
    },
    "android": {
      "permissions": ["android.permission.CAMERA"]
    },
  },
};