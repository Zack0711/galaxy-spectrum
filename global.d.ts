declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    LINK_ACTIVE_ENV: string
    LINK_API_ROOT: string
    LINK_GTM_AUTH: string
    LINK_GTM_PREVIEW: string
    LINK_GTM_ID: string
    LINK_AMPLITUDE_API_KEY: string
    LINK_GAME_PASSTHROUGH_URL_PARAM_REGEX: string
    LINK_DEFAULT_USER_PHOTO: string
    LINK_PRIVACY_POLICY: string
    LINK_ALLOWED_ORIGINS: string
  }

  interface Process {
    browser: boolean
  }

  interface Global {
    window: any
    miniApp: any
    gameId: string
  }
}

declare module 'uppercamelcase'
declare module 'isomorphic-fetch'
declare module 'uuid/v4'
declare module 'viber-bridge'
declare module 'miniApp'
declare module 'jwt-decode'
