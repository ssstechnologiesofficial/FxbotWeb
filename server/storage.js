// Simple in-memory storage for development
class MemStorage {
  constructor() {
    this.data = {
      contacts: [],
      subscribers: [],
      users: []
    };
  }

  // Contact form submissions
  async createContact(contactData) {
    const contact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString()
    };
    this.data.contacts.push(contact);
    return contact;
  }

  async getContacts() {
    return this.data.contacts;
  }

  // Newsletter subscriptions
  async createSubscriber(email) {
    const subscriber = {
      id: Date.now().toString(),
      email,
      createdAt: new Date().toISOString()
    };
    this.data.subscribers.push(subscriber);
    return subscriber;
  }

  async getSubscribers() {
    return this.data.subscribers;
  }

  // Users (for future authentication)
  async createUser(userData) {
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    return user;
  }

  async getUserByEmail(email) {
    return this.data.users.find(user => user.email === email);
  }

  async getUsers() {
    return this.data.users;
  }
}

let storage = null;

export function getStorage() {
  if (!storage) {
    storage = new MemStorage();
  }
  return storage;
}