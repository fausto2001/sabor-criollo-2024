import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'sabor-criollo',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  ios: {
    handleApplicationNotifications: false
  }
};

export default config;
