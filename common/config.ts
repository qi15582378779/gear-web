import env_dev from "../.env.dev.json";
import env_local from "../.env.local.json";
import env_prod from "../.env.prod.json";

const config: any = (() => {
  const env = process.env.APP_ENV;

  if (env === "local") {
    return env_local;
  } else if (env === "dev") {
    return env_dev;
  } else if (env === "prod") {
    return env_prod;
  }
})();

export function getConfig(_key: string, _default: any = null) {
  if (Object.keys(config).includes(_key)) {
    return config[_key];
  } else {
    return _default;
  }
}

export function setConfig(_key: string, _value: any) {
  config[_key] = _value;
}
