export const isProductionEnv = (): boolean =>
  window?.location.href.indexOf(`http://localhost`) !== 0;
