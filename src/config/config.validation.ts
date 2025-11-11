import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  app: Joi.object({
    port: Joi.number().default(3000),
    nodeEnv: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
  }),

  database: Joi.object({
    url: Joi.string().uri().required(),
  }),

  jwt: Joi.object({
    accessTokenSecret: Joi.string().required(),
    refreshTokenSecret: Joi.string().required(),
    accessExpiration: Joi.string().default('900s'),
    refreshExpiration: Joi.string().default('7d'),
  }),
});
