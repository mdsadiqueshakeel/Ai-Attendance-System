export const isSeedEnabled = () => {
  if (!__DEV__) return false;
  const v =
    process.env.EXPO_PUBLIC_APP_SEED_ENABLED ??
    process.env.APP_SEED_ENABLED ??
    '';
  return String(v).toLowerCase() === 'true' || String(v) === '1';
};

