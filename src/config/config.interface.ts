export interface AppConfig {
  app: {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
  };
  database: {
    url: string;
  };
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  aws: {
    region: string;
    s3Bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  redis: {
    host: string;
    port: number;
  };
}
