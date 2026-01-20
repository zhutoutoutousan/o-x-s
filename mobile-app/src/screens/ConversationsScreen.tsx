import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useChat } from '../context/ChatContext';
import { useAI } from '../context/AIContext';
import { Conversation } from '../types';
import { format } from 'date-fns';

export default function ConversationsScreen() {
  const navigation = useNavigation();
  const { conversations, setCurrentConversation, createConversation } = useChat();
  const { aiActive, activateAIMode } = useAI();

  const handleCreateConversation = async () => {
    Alert.prompt(
      'New Conversation',
      'Enter name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (name) => {
            if (name) {
              const id = await createConversation(name, false);
              navigation.navigate('Chat' as never, { conversationId: id, name } as never);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleCreateAIConversation = async () => {
    Alert.alert(
      'Activate AI Assistant',
      'This will activate the AI assistant based on your loved one\'s personality. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          onPress: async () => {
            const id = await createConversation('AI Assistant', true);
            await activateAIMode();
            navigation.navigate('Chat' as never, { conversationId: id, name: 'AI Assistant' } as never);
          },
        },
      ]
    );
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const lastMessageText = lastMessage
      ? lastMessage.text.substring(0, 50) + (lastMessage.text.length > 50 ? '...' : '')
      : 'No messages yet';

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => {
          setCurrentConversation(item);
          navigation.navigate('Chat' as never, {
            conversationId: item.id,
            name: item.name,
          } as never);
        }}
      >
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName}>
              {item.name} {item.isAI && '🤖'}
            </Text>
            <Text style={styles.conversationTime}>
              {item.updatedAt
                ? format(new Date(item.updatedAt), 'MMM d')
                : ''}
            </Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversations</Text>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => navigation.navigate('AISettings' as never)}
        >
          <Text style={styles.aiButtonText}>AI Settings</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>
              Start chatting to train your AI assistant
            </Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, styles.cameraFab]}
          onPress={() => navigation.navigate('Camera' as never)}
        >
          <Text style={styles.fabText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateConversation}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        {aiActive && (
          <TouchableOpacity
            style={[styles.fab, styles.aiFab]}
            onPress={handleCreateAIConversation}
          >
            <Text style={styles.fabText}>🤖</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  aiButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  aiButtonText: {
    color: '#d4af37',
    fontSize: 14,
  },
  conversationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f5f5f5',
  },
  conversationTime: {
    fontSize: 14,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    color: '#f5f5f5',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    gap: 15,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  aiFab: {
    backgroundColor: '#c77dff',
  },
  cameraFab: {
    backgroundColor: '#3498db',
  },
  fabText: {
    fontSize: 24,
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
});
