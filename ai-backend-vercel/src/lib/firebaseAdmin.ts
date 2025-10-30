import admin from 'firebase-admin';

let app: admin.app.App | undefined;

export function getAdminApp() {
  if (app) return app;
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
  }
  const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  app = admin.initializeApp({
    credential: admin.credential.cert(svc)
  });
  return app;
}

export function getDb() {
  return getAdminApp().firestore();
}


