import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useChat } from '../context/ChatContext';
import { useAI } from '../context/AIContext';

export default function AISettingsScreen() {
  const { conversations } = useChat();
  const {
    aiEnabled,
    aiActive,
    learningProgress,
    toggleAI,
    trainAI,
    activateAIMode,
    deactivateAIMode,
    startActiveMessaging,
    stopActiveMessaging,
  } = useAI();

  const [isTraining, setIsTraining] = useState(false);
  const [activeMessagingEnabled, setActiveMessagingEnabled] = useState(false);

  const handleTrainAI = async () => {
    // Collect all messages from all conversations
    const allMessages = conversations.flatMap(conv => conv.messages);
    
    if (allMessages.length < 10) {
      Alert.alert(
        'Not Enough Data',
        'You need at least 10 messages to train the AI. Keep chatting!'
      );
      return;
    }

    Alert.alert(
      'Train AI Assistant',
      `This will analyze ${allMessages.length} messages to learn your loved one's communication style. This may take a few minutes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Train',
          onPress: async () => {
            setIsTraining(true);
            try {
              await trainAI(allMessages);
              Alert.alert('Success', 'AI has been trained successfully!');
              await toggleAI();
            } catch (error) {
              Alert.alert('Error', 'Failed to train AI. Please try again.');
            } finally {
              setIsTraining(false);
            }
          },
        },
      ]
    );
  };

  const handleActivateAI = async () => {
    Alert.alert(
      'Activate AI Mode',
      'This will activate the AI assistant to take the place of your loved one. The AI will learn from your conversations and can actively message you. This is a sensitive feature - are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          style: 'destructive',
          onPress: async () => {
            await activateAIMode();
            Alert.alert(
              'AI Activated',
              'The AI assistant is now active and will continue your conversations.'
            );
          },
        },
      ]
    );
  };

  const handleToggleActiveMessaging = async () => {
    if (!activeMessagingEnabled) {
      await startActiveMessaging();
      setActiveMessagingEnabled(true);
      Alert.alert(
        'Active Messaging Enabled',
        'The AI will now proactively message you throughout the day.'
      );
    } else {
      stopActiveMessaging();
      setActiveMessagingEnabled(false);
    }
  };

  const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Training</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Messages Collected</Text>
            <Text style={styles.settingValue}>{totalMessages} messages</Text>
          </View>
        </View>

        {isTraining ? (
          <View style={styles.trainingContainer}>
            <ActivityIndicator size="large" color="#d4af37" />
            <Text style={styles.trainingText}>Training AI...</Text>
            <Text style={styles.progressText}>{learningProgress}%</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              totalMessages < 10 && styles.buttonDisabled,
            ]}
            onPress={handleTrainAI}
            disabled={totalMessages < 10}
          >
            <Text style={styles.buttonText}>Train AI from Messages</Text>
          </TouchableOpacity>
        )}

        {learningProgress > 0 && learningProgress < 100 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${learningProgress}%` }]}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Status</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>AI Enabled</Text>
          <Switch
            value={aiEnabled}
            onValueChange={toggleAI}
            trackColor={{ false: '#767577', true: '#d4af37' }}
            thumbColor={aiEnabled ? '#f5f5f5' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>AI Active Mode</Text>
            <Text style={styles.settingDescription}>
              When activated, AI takes the place of your loved one
            </Text>
          </View>
          <Switch
            value={aiActive}
            onValueChange={(value) => {
              if (value) {
                handleActivateAI();
              } else {
                deactivateAIMode();
              }
            }}
            trackColor={{ false: '#767577', true: '#c77dff' }}
            thumbColor={aiActive ? '#f5f5f5' : '#f4f3f4'}
            disabled={!aiEnabled}
          />
        </View>
      </View>

      {aiActive && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Messaging</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Proactive Messages</Text>
              <Text style={styles.settingDescription}>
                AI will actively message you throughout the day
              </Text>
            </View>
            <Switch
              value={activeMessagingEnabled}
              onValueChange={handleToggleActiveMessaging}
              trackColor={{ false: '#767577', true: '#ff6b9d' }}
              thumbColor={activeMessagingEnabled ? '#f5f5f5' : '#f4f3f4'}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          The AI assistant learns from your conversations to understand communication
          style, topics, emotional tone, and relationship details. When activated,
          it can continue conversations in a way that reflects your loved one's
          personality.
        </Text>
        <Text style={styles.warningText}>
          ⚠️ This is a sensitive feature. Use with care and understanding.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#f5f5f5',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  trainingText: {
    color: '#f5f5f5',
    fontSize: 16,
    marginTop: 10,
  },
  progressText: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#d4af37',
  },
  aboutText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  warningText: {
    color: '#ff6b9d',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
  },
});
