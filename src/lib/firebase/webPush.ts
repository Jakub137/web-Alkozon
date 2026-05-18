function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isWebPushEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_WEB_PUSH === "true";
}

function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

async function getMessagingApi() {
  const [{ initializeApp, getApps, getApp }, { getMessaging, getToken, isSupported }] =
    await Promise.all([import("firebase/app"), import("firebase/messaging")]);

  const supported = await isSupported();
  if (!supported) return null;

  const firebaseConfig = getFirebaseConfig();
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!firebaseConfig || !vapidKey) return null;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  return { getToken, messaging, vapidKey };
}

export async function setupWebPushToken(): Promise<string | null> {
  if (!isBrowser() || !isWebPushEnabled()) return null;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;
  if (Notification.permission === "denied") return null;

  const api = await getMessagingApi();
  if (!api) return null;

  const permission =
    Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    const token = await api.getToken(api.messaging, {
      vapidKey: api.vapidKey,
      serviceWorkerRegistration,
    });
    return token || null;
  } catch {
    return null;
  }
}
