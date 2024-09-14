interface Config {
  api_base_url: string;
}

export const config: Config = {
  api_base_url: import.meta.env.VITE_API_URL,
};
