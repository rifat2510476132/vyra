import admin from 'firebase-admin';



let initialized = false;



export function initFirebase() {

  if (initialized || !process.env.FIREBASE_PROJECT_ID) return;

  try {

    admin.initializeApp({

      credential: admin.credential.cert({

        projectId: process.env.FIREBASE_PROJECT_ID,

        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),

      }),

    });

    initialized = true;

  } catch {

    console.warn('FCM: Firebase init skipped');

  }

}



export function isFirebaseReady(): boolean {

  return initialized;

}



export async function sendPush(

  token: string,

  title: string,

  body: string,

  data?: Record<string, string>

) {

  if (!initialized || !token) return;

  try {

    await admin.messaging().send({

      token,

      notification: { title, body },

      data,

    });

  } catch (err) {

    console.warn('FCM send failed:', err);

  }

}



export async function sendPushMany(

  tokens: string[],

  title: string,

  body: string,

  data?: Record<string, string>

) {

  if (!initialized || !tokens.length) return;

  const unique = [...new Set(tokens.filter(Boolean))];

  await Promise.allSettled(

    unique.map((token) => sendPush(token, title, body, data))

  );

}


