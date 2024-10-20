import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import moment from 'moment';

const WatchCheck = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const { user } = useUser();
  const [progressAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchLastCheckIn();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && lastCheckIn) {
      interval = setInterval(() => {
        const now = moment();
        const checkInTime = moment(lastCheckIn, 'HH:mm:ss');
        const duration = moment.duration(now.diff(checkInTime));
        setElapsedTime(
          `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(
            duration.seconds()
          ).padStart(2, '0')}`
        );
        progressAnimation.setValue(duration.asSeconds() % 60);
      }, 1000);
    } else {
      setElapsedTime('00:00:00');
      progressAnimation.setValue(0);
    }
    return () => clearInterval(interval);
  }, [isRunning, lastCheckIn, progressAnimation]);

  const fetchLastCheckIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://attention.cl/api/reloj-control/last-check-in', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.lastCheckIn) {
        setLastCheckIn(data.lastCheckIn);
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo recuperar la última hora de marcación');
    } finally {
      setIsLoading(false);
    }
  }, [user.token]);

  const handleAction = useCallback(async () => {
    setIsLoading(true);
    const url = `https://attention.cl/api/reloj-control/${isRunning ? 'stop' : 'start'}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const currentTime = moment().format('HH:mm:ss');
        if (isRunning) {
          setLastCheckIn(null);
          setIsRunning(false);
          Alert.alert('Éxito', `Cronómetro detenido a las ${currentTime}`);
        } else {
          setLastCheckIn(currentTime);
          setIsRunning(true);
          Alert.alert('Éxito', `Cronómetro iniciado a las ${currentTime}`);
        }
      } else {
        throw new Error(data.message || `Error al ${isRunning ? 'detener' : 'iniciar'} el cronómetro`);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isRunning, user.token]);

  const progressInterpolation = progressAnimation.interpolate({
    inputRange: [0, 60],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.gradientContainer}
      >
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.progressCircle,
              {
                transform: [{ rotate: progressInterpolation }],
              },
            ]}
          />
          <View style={styles.innerCircle}>
            <Text style={styles.elapsedTimeText}>{elapsedTime}</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.statusText}>{isRunning ? 'EN MARCHA' : 'DETENIDO'}</Text>
          <Text style={styles.lastCheckIn}>
            Última marcación: {lastCheckIn || 'No disponible'}
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#6200EE" />
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
              <LinearGradient
                colors={isRunning ? ['#F44336', '#D32F2F'] : ['#4CAF50', '#388E3C']}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>{isRunning ? 'DETENER' : 'INICIAR'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#4CAF50',
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  elapsedTimeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    letterSpacing: 2,
  },
  lastCheckIn: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  actionButton: {
    overflow: 'hidden',
    borderRadius: 25,
    elevation: 5,
  },
  actionButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default WatchCheck;