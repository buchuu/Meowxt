import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { GiftedChat, Actions, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';

// --- MAIN APP COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState('Login'); // Screens: Login, Home, Chat
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');

  // Mock data for chat list
  const chats = [
    { id: '1', name: 'Person A', lastMsg: 'Hey, how are you?' },
    { id: '2', name: 'Person B', lastMsg: 'Check out this photo!' },
  ];

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  // Setup initial messages
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Welcome to your new chat app!',
        createdAt: new Date(),
        user: { _id: 2, name: 'System' },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, []);

  // --- UI COMPONENTS ---

  const LoginScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 💬</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter Username (e.g., @insta_user)" 
        value={username} 
        onChangeText={setUsername}
      />
      <TouchableOpacity style={styles.button} onPress={() => setScreen('Home')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const HomeScreen = () => (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search chats..." 
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList 
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => setScreen('Chat')}>
            <View style={styles.avatar}><Text style={{color: '#fff'}}>{item.name[7]}</Text></View>
            <View>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.chatLastMsg}>{item.lastMsg}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );

  const ChatScreen = () => (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setScreen('Home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.chatHeaderTitle}>Person A</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: 1, name: username }}
        placeholder="Type a message..."
        alwaysShowSend
        renderActions={(props) => (
          <Actions
            {...props}
            options={{
              'Send Image': () => alert('Image picker placeholder'),
              'Send Audio': () => alert('Audio recorder placeholder'),
              Cancel: () => {},
            }}
            icon={() => <Ionicons name="add-circle" size={28} color="#007AFF" />}
          />
        )}
      />
    </View>
  );

  return screen === 'Login' ? <LoginScreen /> : screen === 'Home' ? <HomeScreen /> : <ChatScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#f8f9fa' },
  safe: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', margin: 15, paddingHorizontal: 15, borderRadius: 10 },
  searchInput: { flex: 1, padding: 10 },
  chatItem: { flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  chatName: { fontSize: 18, fontWeight: '600' },
  chatLastMsg: { color: '#777' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chatHeaderTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20 }
});
