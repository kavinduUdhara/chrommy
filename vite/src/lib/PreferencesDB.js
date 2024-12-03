const PREF_STORE_NAME = "preferences";
import { initDB } from "./chatHistoryDB";

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
