interface Config {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const config: Config = {
  apiKey: process.env.apiKey!,
  authDomain: process.env.authDomain!,
  projectId: process.env.projectId!,
  storageBucket: process.env.storageBucket!,
  messagingSenderId: process.env.messagingSenderId!,
  appId: process.env.appId!,
};
