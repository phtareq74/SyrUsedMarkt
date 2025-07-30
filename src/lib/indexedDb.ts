export interface DraftAdData {
  title?: string;
  description?: string;
  website?: string;
  mustGo?: boolean;
  highlightAd?: boolean;
  askingPrice?: string;
  province?: string;
  place?: string;
  addressDetails?: string;
  priceType?: string;
  images?: File[]; // or Blob[] depending on how you handle them
  featureValues?: Record<string, string>;
  [key: string]: unknown; // optional: keep for future flexibility
}

const DB_NAME = "PostAdDB";
const DB_VERSION = 1;
const STORE_NAME = "drafts";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject("Failed to open IndexedDB");
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveDraft(key: string, data: DraftAdData): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put(data, key);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function getDraft(key: string): Promise<DraftAdData | undefined> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result as DraftAdData | undefined);
    };

    request.onerror = () => {
      reject("Failed to retrieve draft");
    };
  });
}

export async function deleteDraft(key: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(key);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
