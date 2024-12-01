import { openDB } from "idb";
import React from "react";

const DB_NAME = "ChatHistoryDB";
const DB_VERSION = 4;
const STORE_NAME = "chats";

// Initialize the database
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id", // Use the provided 'id' instead of auto-increment
        });

        // Create index on 'modifiedAt' field
        store.createIndex("modifiedAt", "modifiedAt", { unique: false });

        // Create index on 'domain' field
        store.createIndex("domain", "domain", { unique: false });
      }
    },
  });
};

// Create a new chat with custom 'id'
export const createNewChat = async ({
  id, // Pass 'id' explicitly
  domain,
  title,
  chatData = [],
  error = null,
}) => {
  const db = await initDB();
  const timestamp = Date.now();
  const chat = {
    id, // Use the provided 'id'
    createdAt: timestamp,
    modifiedAt: timestamp,
    domain,
    title,
    chatData,
    error,
  };
  await db.add(STORE_NAME, chat); // Add the chat using the provided 'id'
  return id; // Return the provided 'id'
};

// Update chat by ID
export const updateChatByID = async (id, chatData) => {
  const db = await initDB();
  const chat = await db.get(STORE_NAME, id);
  if (!chat) throw new Error(`Chat with ID ${id} not found`);

  // Sanitize the chatData array to ensure it's serializable and remove 'preview'
  chat.chatData = chatData.map(({ user, text, context, cmds }) => ({
    user,
    text,
    context,
    cmds,
    // Do not include preview
  }));
  console.log("chat in DB", chat);

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
