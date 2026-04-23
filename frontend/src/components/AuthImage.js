import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { isBackendFileUrl, toAbsoluteUrl } from '../utils/urlUtils';

const AuthImage = ({ uri, style, resizeMode = 'cover', showLoader = true }) => {
  const [token, setToken] = useState(undefined); // undefined = not loaded yet
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const absoluteUri = useMemo(() => toAbsoluteUrl(uri), [uri]);
  const needsAuth = useMemo(() => isBackendFileUrl(uri), [uri]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (!needsAuth) {
          if (mounted) setToken(null);
          return;
        }
        const t = await AsyncStorage.getItem('jwt_token');
        if (mounted) setToken(t);
      } finally {
        // no-op: image loading indicator handled by Image callbacks
      }
    };

    setFailed(false);
    setToken(undefined);
    load();

    return () => {
      mounted = false;
    };
  }, [needsAuth, absoluteUri]);

  if (!uri || failed) {
    return <View style={[styles.fallback, style]} />;
  }

  const tokenLoaded = token !== undefined;
  if (needsAuth && !tokenLoaded) {
    return (
      <View style={[styles.container, style]}>
        {showLoader && (
          <View style={styles.loader}>
            <ActivityIndicator color="#4F46E5" />
          </View>
        )}
      </View>
    );
  }

  const headers =
    needsAuth && token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={headers ? { uri: absoluteUri, headers } : { uri: absoluteUri }}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setFailed(true)}
      />
      {showLoader && loading && (
        <View style={styles.loader}>
          <ActivityIndicator color="#4F46E5" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#EEF2FF',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  fallback: {
    backgroundColor: '#EEF2FF',
  },
});

export default AuthImage;
