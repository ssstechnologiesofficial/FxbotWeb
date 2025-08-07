interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  message: string;
}

interface Contact extends ContactData {
  id: string;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

interface User extends UserData {
  id: string;
  createdAt: string;
}

interface StorageData {
  contacts: Contact[];
  subscribers: Subscriber[];
  users: User[];
}

// Simple in-memory storage for development
class MemStorage {
  private data: StorageData;

  constructor() {
    this.data = {
      contacts: [],
      subscribers: [],
      users: []
    };
  }

  // Contact form submissions
  async createContact(contactData: ContactData): Promise<Contact> {
    const contact: Contact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString()
    };
    this.data.contacts.push(contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return this.data.contacts;
  }

  // Newsletter subscriptions
  async createSubscriber(email: string): Promise<Subscriber> {
    const subscriber: Subscriber = {
      id: Date.now().toString(),
      email,
      createdAt: new Date().toISOString()
    };
    this.data.subscribers.push(subscriber);
    return subscriber;
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return this.data.subscribers;
  }

  // Users (for future authentication)
  async createUser(userData: UserData): Promise<User> {
    const user: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.data.users.find(user => user.email === email);
  }

  async getUsers(): Promise<User[]> {
    return this.data.users;
  }
}

let storage: MemStorage | null = null;

export function getStorage(): MemStorage {
  if (!storage) {
    storage = new MemStorage();
  }
  return storage;
}

export interface IStorage {
  createContact(contactData: ContactData): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  createSubscriber(email: string): Promise<Subscriber>;
  getSubscribers(): Promise<Subscriber[]>;
  createUser(userData: UserData): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
}