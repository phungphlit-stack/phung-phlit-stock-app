import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const saveStockData = async (role, data) => {
  try {
    const stockRef = ref(db, `stock/${role}`);
    await set(stockRef, data);
    console.log(`Stock saved for ${role}`);
  } catch (error) {
    console.error('Error saving stock:', error);
  }
};

export const listenToStockData = (role, callback) => {
  const stockRef = ref(db, `stock/${role}`);
  onValue(stockRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};

export const sendMessage = async (role, message) => {
  try {
    const messagesRef = ref(db, `messages/${role}`);
    await push(messagesRef, {
      from: message.from,
      text: message.text,
      time: new Date().toISOString(),
    });
    console.log('Message sent');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const listenToMessages = (role, callback) => {
  const messagesRef = ref(db, `messages/${role}`);
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messages = Object.entries(data).map(([key, msg]) => ({
        id: key,
        from: msg.from,
        text: msg.text,
        time: new Date(msg.time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      }));
      callback(messages.reverse());
    }
  });
};
