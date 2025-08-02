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

export interface AdData extends DraftAdData {
  id?: number;
  userId?: string;
  createdAt?: number;
}

const DB_NAME = "PostAdDB";
const DB_VERSION = 2; // Bump to 2 to add "ads" store
const DRAFTS_STORE = "drafts";
const ADS_STORE = "ads";

// Open DB and ensure both object stores exist
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject("❌ Failed to open IndexedDB");
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Create "drafts" store if not exists
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        db.createObjectStore(DRAFTS_STORE);
      }

      // Create "ads" store with auto-incrementing id
      if (!db.objectStoreNames.contains(ADS_STORE)) {
        db.createObjectStore(ADS_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

//
// ========== Drafts Functions ==========
//

export async function saveDraft(key: string, data: DraftAdData): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(DRAFTS_STORE, "readwrite");
  const store = tx.objectStore(DRAFTS_STORE);
  store.put(data, key);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function getDraft(key: string): Promise<DraftAdData | undefined> {
  const db = await openDB();
  const tx = db.transaction(DRAFTS_STORE, "readonly");
  const store = tx.objectStore(DRAFTS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result as DraftAdData | undefined);
    request.onerror = () => reject("❌ Failed to retrieve draft");
  });
}

export async function deleteDraft(key: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(DRAFTS_STORE, "readwrite");
  const store = tx.objectStore(DRAFTS_STORE);
  store.delete(key);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

//
// ========== Ads Functions ==========
//

export async function saveAd(ad: AdData): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(ADS_STORE, "readwrite");
  const store = tx.objectStore(ADS_STORE);

  const dataToSave = {
    ...ad,
    createdAt: Date.now(),
  };

  // Don't save an undefined/null/empty id (let IndexedDB auto-assign)
  if (!dataToSave.id) {
    delete dataToSave.id;
  }

  store.put(dataToSave);

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllAds(): Promise<AdData[]> {
  const db = await openDB();
  const tx = db.transaction(ADS_STORE, "readonly");
  const store = tx.objectStore(ADS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as AdData[]);
    request.onerror = () => reject("❌ Failed to get ads");
  });
}

export async function getUserAds(userId: string): Promise<AdData[]> {
  const all = await getAllAds();
  return all.filter((ad) => ad.userId === userId);
}

// lib/indexedDB.ts

export async function deleteAd(id: number): Promise<void> {
  const db = await openDB(); // Assumes openDB handles "ads" store
  const tx = db.transaction("ads", "readwrite");
  const store = tx.objectStore("ads");
  store.delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}


