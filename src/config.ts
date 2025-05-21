interface ApiConfig {
  baseUrl: string;
  token: string;
}

export const apiConfig: ApiConfig = {
  baseUrl: process.env.API_URL,
  token: process.env.API_TOKEN,
};
