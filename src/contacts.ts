import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';

import type { Contact } from './types/Contact';

const queryContacts = async () => {
  const retVal = await localforage.getItem<Array<Contact>>('contacts');
  return retVal ?? [];
};

export async function getContacts(query?: string | null) {
  await fakeNetwork(`getContacts:${query}`);
  const contacts = await (async () => {
    const result = await queryContacts();
    return query
      ? matchSorter(result, query, { keys: ['first', 'last'] })
      : result;
  })();
  return contacts.sort(sortBy('last', 'createdAt'));
}

export async function createContact() {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const contact = { id, createdAt: Date.now() };
  const contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);
  const contacts = await queryContacts();
  return contacts?.find((contact) => contact.id === id) ?? null;
}

export async function updateContact(
  id: string,
  updates: Omit<Contact, 'id' | 'createdAt'>
) {
  await fakeNetwork();
  const contacts = await queryContacts();
  const contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error(`No contact found for ${id}`);
  const updated = {
    ...contact,
    ...updates,
  };
  const contactsToSet = contacts.map((c) => {
    if (id !== c.id) return c;
    return updated;
  });
  await set(contactsToSet);
  return updated;
}

export async function deleteContact(id: string) {
  const contacts = await queryContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: Array<Contact>) {
  return localforage.setItem('contacts', contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key?: string) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key as keyof typeof fakeCache]) {
    return;
  }

  fakeCache[key as keyof typeof fakeCache] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
