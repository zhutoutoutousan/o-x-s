import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';
import ConversationsScreen from './src/screens/ConversationsScreen';
import AISettingsScreen from './src/screens/AISettingsScreen';
import CameraScreen from './src/screens/CameraScreen';
import { ChatProvider } from './src/context/ChatContext';
import { AIProvider } from './src/context/AIContext';

const Stack = createStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingEmoji}>💕</Text>
      <Text style={styles.loadingText}>Love AI Messenger</Text>
      <ActivityIndicator size="large" color="#d4af37" style={styles.spinner} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AIProvider>
        <ChatProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1a1a2e',
                },
                headerTintColor: '#d4af37',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Conversations" 
                component={ConversationsScreen}
                options={{ title: '💕 Messages' }}
              />
              <Stack.Screen 
                name="Chat" 
                component={ChatScreen}
                options={({ route }: any) => ({ 
                  title: route.params?.name || 'Chat',
                  headerBackTitleVisible: false
                })}
              />
              <Stack.Screen 
                name="AISettings" 
                component={AISettingsScreen}
                options={{ title: 'AI Assistant' }}
              />
              <Stack.Screen 
                name="Camera" 
                component={CameraScreen}
                options={{ 
                  title: 'Camera',
                  headerShown: false
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ChatProvider>
      </AIProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 28,
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  spinner: {
    marginTop: 20,
  },
});
