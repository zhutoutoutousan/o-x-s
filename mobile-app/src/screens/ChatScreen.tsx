import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { useChat } from '../context/ChatContext';
import { useAI } from '../context/AIContext';
import { Message as AppMessage } from '../types';

export default function ChatScreen() {
  const route = useRoute();
  const { conversationId } = route.params as { conversationId: string; name: string };
  const { conversations, sendMessage, setCurrentConversation } = useChat();
  const { aiActive, getAIResponse } = useAI();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const conversation = conversations.find(c => c.id === conversationId);

  useEffect(() => {
    if (conversation) {
      setCurrentConversation(conversation);
      const giftedMessages: IMessage[] = conversation.messages
        .map(msg => ({
          _id: msg.id,
          text: msg.text,
          createdAt: msg.createdAt,
          user: {
            _id: msg.userId === 'user' ? 1 : 2,
            name: msg.userId === 'user' ? 'You' : (msg.userId === 'ai' ? 'AI Assistant' : conversation.name),
            avatar: msg.userId === 'ai' ? '🤖' : (msg.userId !== 'user' ? '💕' : undefined),
          },
        }))
        .reverse();
      setMessages(giftedMessages);
    }
  }, [conversation, conversationId, setCurrentConversation]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    if (message && message.text) {
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
      await sendMessage(message.text, conversationId);
    }
  }, [conversationId, sendMessage]);

  const user: User = {
    _id: 1,
    name: 'You',
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        placeholder="Type a message..."
        renderAvatar={() => null}
        renderBubble={(props) => (
          <View
            style={[
              styles.bubble,
              props.currentMessage?.user._id === 1
                ? styles.userBubble
                : styles.aiBubble,
            ]}
          >
            {props.currentMessage?.user.avatar && (
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>{props.currentMessage.user.avatar}</View>
              </View>
            )}
            <View style={styles.bubbleContent}>
              {props.currentMessage?.text && (
                <View style={styles.textContainer}>
                  {props.renderText(props.currentMessage)}
                </View>
              )}
            </View>
          </View>
        )}
        textInputStyle={styles.textInput}
        renderInputToolbar={(props) => (
          <View style={styles.inputToolbar}>
            {props.renderComposer(props)}
            {props.renderSend(props)}
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  bubble: {
    padding: 10,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#d4af37',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  aiBubble: {
    backgroundColor: 'rgba(199, 125, 255, 0.3)',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
  },
  bubbleContent: {
    flex: 1,
  },
  textContainer: {
    padding: 4,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#f5f5f5',
    fontSize: 16,
  },
  inputToolbar: {
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
