import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

// Default to Mac local network IP where Vite server is running
const DEFAULT_URL = 'http://192.168.31.179:8443';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [lastCoords, setLastCoords] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');

  // Send coordinates to the WebView via postMessage + injectJavaScript
  const sendLocationToWebView = useCallback((coords, address) => {
    if (webViewRef.current) {
      const payload = {
        type: 'NATIVE_GPS_COORDS',
        coords: {
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy || 8,
        },
        address: address || `Live GPS (${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°)`,
      };

      // 1. Post message to webview
      webViewRef.current.postMessage(JSON.stringify(payload));

      // 2. Direct script injection to guarantee receipt
      const script = `
        window.__EXPO_COORDS__ = ${JSON.stringify(payload)};
        if (typeof window.__ON_GPS_COORDS__ === 'function') {
          window.__ON_GPS_COORDS__(${JSON.stringify(payload)});
        }
        window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(payload)} }));
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, []);

  // Request native permission and fetch real GPS coordinates
  const fetchAndBroadcastLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'NATIVE_GPS_DENIED',
              message: 'Foreground location permission denied by user',
            })
          );
        }
        return;
      }

      // Fetch accurate GPS position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLastCoords(location.coords);

      let resolvedAddress = 'Live Location';
      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (reverse && reverse.length > 0) {
          const item = reverse[0];
          const area = item.name || item.street || item.district || item.subregion || 'Live GPS';
          const city = item.city || item.region || 'Panipat';
          resolvedAddress = `${area}, ${city}`;
        }
      } catch (revErr) {
        resolvedAddress = `Live GPS (${location.coords.latitude.toFixed(4)}°, ${location.coords.longitude.toFixed(4)}°)`;
      }

      sendLocationToWebView(location.coords, resolvedAddress);
    } catch (err) {
      console.warn('Could not acquire native location:', err);
    }
  }, [sendLocationToWebView]);

  useEffect(() => {
    // Check initial permission status
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      setPermissionStatus(status);
      if (status === 'granted') {
        fetchAndBroadcastLocation();
      }
    }).catch(() => {});
  }, [fetchAndBroadcastLocation]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }
  }, [canGoBack]);

  const handleReload = () => {
    setError(false);
    setLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  // Handle messages sent from React Web App
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'REQUEST_LIVE_LOCATION') {
        fetchAndBroadcastLocation();
      } else if (data.type === 'PING_NATIVE') {
        if (lastCoords) {
          sendLocationToWebView(lastCoords);
        } else {
          fetchAndBroadcastLocation();
        }
      }
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#fffefb" translucent={false} />
      <View style={styles.container}>
        {/* Permission Request Header Bar for Expo Mobile */}
        {permissionStatus !== 'granted' && (
          <TouchableOpacity
            style={styles.permissionBanner}
            activeOpacity={0.8}
            onPress={fetchAndBroadcastLocation}
          >
            <Text style={styles.permissionIcon}>📍</Text>
            <View style={styles.permissionTextContainer}>
              <Text style={styles.permissionTitle}>Location Access Required</Text>
              <Text style={styles.permissionSubtitle}>Tap to allow GPS for Panipat distance calculator</Text>
            </View>
            <View style={styles.permissionBtn}>
              <Text style={styles.permissionBtnText}>ALLOW</Text>
            </View>
          </TouchableOpacity>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Ook Mart</Text>
              <Text style={styles.errorMessage}>
                Could not connect to the live server at:
              </Text>
              <Text style={styles.urlText}>{url}</Text>
              <Text style={styles.hintText}>
                Make sure your phone and Mac are connected to the same Wi-Fi network.
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
                <Text style={styles.retryText}>Retry Connection</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            allowsInlineMediaPlayback={true}
            mixedContentMode="always"
            geolocationEnabled={true}
            onMessage={handleMessage}
            injectedJavaScriptBeforeContentLoaded={`
              window.__IS_EXPO_APP__ = true;
              true;
            `}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => {
              setLoading(false);
              // Send location to ensure the web app receives it once ready
              fetchAndBroadcastLocation();
            }}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#285c3c" />
                <Text style={styles.loadingText}>Opening Ook Mart...</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffefb',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fafbf7',
  },
  permissionBanner: {
    backgroundColor: '#fef7e0',
    borderBottomWidth: 1,
    borderBottomColor: '#eed799',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 99,
  },
  permissionIcon: {
    fontSize: 20,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#634b07',
  },
  permissionSubtitle: {
    fontSize: 10,
    color: '#856a1b',
    marginTop: 1,
  },
  permissionBtn: {
    backgroundColor: '#285c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  permissionBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  webView: {
    flex: 1,
    backgroundColor: '#fafbf7',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fafbf7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#285c3c',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fafbf7',
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#285c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#285c3c',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
  },
  urlText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#285c3c',
    backgroundColor: '#edf3e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 14,
  },
  hintText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#285c3c',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
