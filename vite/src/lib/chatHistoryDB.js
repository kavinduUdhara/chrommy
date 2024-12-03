import { openDB } from "idb";
import React from "react";

const DB_NAME = "ChatHistoryDB";
const DB_VERSION = 5;
const STORE_NAME = "chats";
const PREF_STORE_NAME = "preferences";

// Initialize the database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create 'chats' store if not exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
        store.createIndex("modifiedAt", "modifiedAt", { unique: false });
        store.createIndex("domain", "domain", { unique: false });
      }

      // Create 'preferences' store if not exists
      if (!db.objectStoreNames.contains(PREF_STORE_NAME)) {
        db.createObjectStore(PREF_STORE_NAME, { keyPath: "id" });
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
  error = {},
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
  chat.chatData = chatData.map(({ user, text, context, cmds, time, id }) => ({
    id,
    user,
    text,
    context,
    cmds,
    time,
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
  console.log("chat in DB", chat);
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

  // Sort chats by 'modifiedAt' in descending order
  return chats
    .map(({ modifiedAt, title, domain, id }) => ({
      modifiedAt,
      title,
      domain,
      id,
    }))
    .sort((a, b) => b.modifiedAt - a.modifiedAt);
};

// Get unique domains from chat data
export const getUniqueDomains = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  // Use the 'domain' index to fetch all domain values
  const index = store.index("domain");
  const domains = await index.getAll();

  // Extract unique domain values
  const uniqueDomains = [...new Set(domains.map((chat) => chat.domain))];

  return uniqueDomains.map((domain) => ({
    value: domain,
    label: domain.charAt(0).toUpperCase() + domain.slice(1), // Capitalize for labels
  }));
};

// Delete all records from the database
export const deleteAllChats = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  await store.clear(); // Clear all records from the object store
  await tx.done; // Ensure the transaction is complete
  console.log("All chats deleted successfully.");
};

// Delete a single chat by ID
export const deleteChatByID = async (id) => {
  const db = await initDB();
  const chat = await db.get(STORE_NAME, id);
  if (!chat) throw new Error(`Chat with ID ${id} not found`);
  
  await db.delete(STORE_NAME, id); // Delete the chat by ID
  console.log(`Chat with ID ${id} has been deleted successfully.`);
};




// Create or Update Preference
export const createNewPreference = async (id, data) => {
  const db = await initDB(); // Initialize the database
  const tx = db.transaction(PREF_STORE_NAME, "readwrite"); // Start a transaction for the 'preferences' store
  const store = tx.objectStore(PREF_STORE_NAME); // Access the 'preferences' object store

  const newPreference = { id, data }; // Create the new preference object
  await store.add(newPreference); // Add the new preference to the store

  await tx.done; // Ensure the transaction is completed
  console.log(`Preference with ID ${id} created successfully.`); // Log the success
};

// Get Preference by ID
export const getPreferenceByID = async (id) => {
  const db = await initDB(); // Initialize the database
  const tx = db.transaction(PREF_STORE_NAME, "readonly"); // Start a read-only transaction
  const store = tx.objectStore(PREF_STORE_NAME); // Access the 'preferences' object store

  const preference = await store.get(id); // Get the preference by ID
  await tx.done; // Ensure the transaction is completed

  if (!preference) {
    console.warn(`Preference with ID ${id} not found.`); // Log a warning if not found
    return null;
  }

  return preference; // Return the found preference
};

export const updatePreferenceByID = async (id, data) => {
    const db = await initDB(); // Initialize the database
    const tx = db.transaction(PREF_STORE_NAME, "readwrite"); // Start a transaction for the 'preferences' store
    const store = tx.objectStore(PREF_STORE_NAME); // Access the 'preferences' object store

    const existingPreference = await store.get(id); // Retrieve the existing preference by ID

    if (!existingPreference) {
        console.warn(`Preference with ID ${id} not found. Unable to update.`); // Log a warning if not found
        return null;
    }

    // Merge existing preference data with new data
    existingPreference.data = { ...existingPreference.data, ...data };

    await store.put(existingPreference); // Save the updated preference back to the store

    await tx.done; // Ensure the transaction is completed
    console.log(`Preference with ID ${id} updated successfully.`); // Log the success
};
