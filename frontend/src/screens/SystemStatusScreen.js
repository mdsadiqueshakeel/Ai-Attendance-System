import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import systemService from '../services/systemService';

const SystemStatusScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [health, setHealth] = useState(null);
  const [apiDocs, setApiDocs] = useState(null);
  const [down, setDown] = useState(false);

  const backendStatus = useMemo(() => {
    const status = health?.status;
    if (!status) return down ? 'DOWN' : 'UNKNOWN';
    return String(status).toUpperCase();
  }, [health, down]);

  const fetchAll = async () => {
    setDown(false);
    try {
      const [h, docs] = await Promise.all([
        systemService.getHealth(),
        systemService.getApiDocs(),
      ]);
      setHealth(h);
      setApiDocs(docs);
    } catch (e) {
      setDown(true);
      setHealth(null);
      setApiDocs(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchAll();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  const statusOk = backendStatus === 'UP';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient colors={['#111827', '#1F2937']} style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <ArrowLeft size={20} color="#fff" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.title}>System Status</Text>
              <Text style={styles.subtitle}>Dev-only diagnostics</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#111827"
              style={{ marginTop: 50 }}
            />
          ) : (
            <>
              <View
                style={[
                  styles.statusCard,
                  statusOk ? styles.statusUp : styles.statusDown,
                ]}
              >
                <View style={styles.statusRow}>
                  {statusOk ? (
                    <CheckCircle2 size={22} color="#059669" />
                  ) : (
                    <XCircle size={22} color="#DC2626" />
                  )}
                  <Text style={styles.statusTitle}>
                    Backend: {backendStatus}
                  </Text>
                </View>
                <Text style={styles.statusSub}>
                  {statusOk
                    ? 'API is reachable and healthy.'
                    : 'Backend is not reachable (or returned an error).'}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>API Docs</Text>
                <Text style={styles.kv}>
                  OpenAPI: {apiDocs?.openapi || '—'}
                </Text>
                <Text style={styles.kv}>
                  Title: {apiDocs?.info?.title || '—'}
                </Text>
                <Text style={styles.kv}>
                  Version: {apiDocs?.info?.version || '—'}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Health Details</Text>
                <Text style={styles.kv}>
                  Status: {health?.status || '—'}
                </Text>
                <Text style={styles.kv}>
                  Components: {health?.components ? 'available' : '—'}
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  body: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  statusCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  statusUp: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusDown: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  statusSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  kv: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },
});

export default SystemStatusScreen;

