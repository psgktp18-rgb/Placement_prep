const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = { users: {} };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json, resetting:', err);
    return { users: {} };
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

class FirestoreAdapter {
  constructor() {
    this.db = loadDB();
  }

  // Ensure user document exists
  getUser(userId) {
    this.db = loadDB();
    if (!this.db.users[userId]) {
      return null;
    }
    return this.db.users[userId].profile || null;
  }

  setUserProfile(userId, profileData) {
    this.db = loadDB();
    if (!this.db.users[userId]) {
      this.db.users[userId] = { profile: {}, subcollections: {} };
    }
    this.db.users[userId].profile = {
      ...this.db.users[userId].profile,
      ...profileData,
      id: userId,
      updated_at: new Date().toISOString()
    };
    saveDB(this.db);
    return this.db.users[userId].profile;
  }

  getSubcollection(userId, collectionName) {
    this.db = loadDB();
    if (!this.db.users[userId] || !this.db.users[userId].subcollections) {
      return [];
    }
    const itemsMap = this.db.users[userId].subcollections[collectionName] || {};
    return Object.values(itemsMap);
  }

  getDocInSubcollection(userId, collectionName, docId) {
    this.db = loadDB();
    if (!this.db.users[userId] || !this.db.users[userId].subcollections) {
      return null;
    }
    const itemsMap = this.db.users[userId].subcollections[collectionName] || {};
    return itemsMap[docId] || null;
  }

  setDocInSubcollection(userId, collectionName, docId, data) {
    this.db = loadDB();
    if (!this.db.users[userId]) {
      this.db.users[userId] = { profile: {}, subcollections: {} };
    }
    if (!this.db.users[userId].subcollections) {
      this.db.users[userId].subcollections = {};
    }
    if (!this.db.users[userId].subcollections[collectionName]) {
      this.db.users[userId].subcollections[collectionName] = {};
    }

    const docRef = {
      ...data,
      id: docId,
      updated_at: new Date().toISOString()
    };

    this.db.users[userId].subcollections[collectionName][docId] = docRef;
    saveDB(this.db);
    return docRef;
  }
}

const dbStorage = new FirestoreAdapter();
module.exports = dbStorage;
