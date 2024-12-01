import { openDB } from "idb";

const DB_NAME = "ChatHistoryDB";
const DB_VERSION = 1;
const STORE_NAME = "chats";

// Initialize the database
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("modifiedAt", "modifiedAt", { unique: false });
      }
    },
  });
};

// Create a new chat
export const createNewChat = async ({
  domain,
  title,
  chatData = {},
  error = null,
}) => {
  const db = await initDB();
  const timestamp = Date.now();
  const id = await db.add(STORE_NAME, {
    createdAt: timestamp,
    modifiedAt: timestamp,
    domain,
    title,
    chatData,
    error,
  });
  return id;
};

// Update chat by ID
export const updateChatByID = async (id, chatData) => {
  const db = await initDB();
  const chat = await db.get(STORE_NAME, id);
  if (!chat) throw new Error(`Chat with ID ${id} not found`);
  chat.chatData = chatData;
  chat.modifiedAt = Date.now();
  await db.put(STORE_NAME, chat);
};

// Update error by ID
export const updateErrorByID = async (id, error) => {
  const db = await initDB();
  const chat = await db.get(STORE_NAME, id);
  if (!chat) throw new Error(`Chat with ID ${id} not found`);
  chat.error = error;
  chat.modifiedAt = Date.now();
  await db.put(STORE_NAME, chat);
};

// Get chat by ID
export const getChatByID = async (id) => {
  const db = await initDB();
  const chat = await db.get(STORE_NAME, id);
  if (!chat) throw new Error(`Chat with ID ${id} not found`);
  return chat;
};

// Load chat list
export const loadChatList = async () => {
  const db = await initDB();
  const chats = await db.getAll(STORE_NAME);
  return chats.map(({ modifiedAt, title, domain, id }) => ({
    modifiedAt,
    title,
    domain,
    id,
  }));
};
