import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, Modal, TouchableOpacity, Animated, Dimensions, Platform } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useUser } from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};
LocaleConfig.defaultLocale = 'es';

const { width } = Dimensions.get('window');

const CalendarScreen = () => {
  const { user } = useUser();
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://attention.cl/api/calendars', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const formattedEvents = formatEvents(response.data);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      Alert.alert("Error", "No se pudieron cargar los eventos del calendario");
    } finally {
      setIsLoading(false);
    }
  };

  const formatEvents = (data) => {
    return data.reduce((acc, event) => {
      const date = event.start.split('T')[0];
      if (!acc[date]) acc[date] = { dots: [], events: [] };
      acc[date].dots.push({ color: getRandomColor() });
      acc[date].events.push({ ...event, key: event.id });
      return acc;
    }, {});
  };

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddEvent = async () => {
    if (!title) {
      Alert.alert("Error", "Por favor ingrese un título para el evento");
      return;
    }
    try {
      const response = await axios.post('https://attention.cl/api/calendars', {
        title,
        start: selectedDate,
        end: selectedDate
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 201) {
        const newEvent = { ...response.data, key: response.data.id };
        const updatedEvents = { 
          ...events, 
          [selectedDate]: {
            dots: [...(events[selectedDate]?.dots || []), { color: getRandomColor() }],
            events: [...(events[selectedDate]?.events || []), newEvent]
          }
        };
        setEvents(updatedEvents);
        setTitle("");
        setModalVisible(false);
        Alert.alert("Éxito", "Evento agregado correctamente");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      Alert.alert("Error", "No se pudo agregar el evento");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await axios.delete(`https://attention.cl/api/calendars/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 204) {
        const updatedEvents = { ...events };
        updatedEvents[selectedDate].events = updatedEvents[selectedDate].events.filter(event => event.id !== id);
        if (updatedEvents[selectedDate].events.length === 0) {
          delete updatedEvents[selectedDate];
        } else {
          updatedEvents[selectedDate].dots.pop();
        }
        setEvents(updatedEvents);
        Alert.alert("Éxito", "Evento eliminado correctamente");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error", "No se pudo eliminar el evento");
    }
  };

  const renderEventsForDay = (date) => {
    setSelectedDate(date);
    setTitle("");
    setModalVisible(true);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
     
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradientBackground}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
         <LottieView
          source={{ uri: 'https://path-to-your-static-server/calendar-loading.json' }}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
          </View>
        ) : (
          <>

<Calendar
  minDate={new Date().toISOString().split('T')[0]}
  markedDates={Object.keys(events).reduce((acc, date) => {
    acc[date] = {
      dots: events[date].dots,
      marked: true,
    };
    return acc;
  }, {})}
  onDayPress={(day) => renderEventsForDay(day.dateString)}
  theme={{
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: '#ffffff',
    selectedDayBackgroundColor: '#ffffff',
    selectedDayTextColor: '#4c669f',
    todayTextColor: '#ffffff',
    dayTextColor: '#ffffff',
    textDisabledColor: '#d9e1e8',
    dotColor: '#ffffff',
    selectedDotColor: '#4c669f',
    arrowColor: 'white',
    monthTextColor: 'white',
    textDayFontSize: 24,  // Reducir para evitar que se corten los números
    textMonthFontSize: 24,
    textDayHeaderFontSize: 16,
  }}
  style={{
    height: 800, // Aumentar la altura para dar más espacio a cada celda del día
    marginTop: 140,
    marginBottom: 20
  }}
  markingType={'multi-dot'}
/>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <BlurView intensity={100} style={styles.modalContainer} tint="dark">
                <Animated.View 
                  style={[styles.modalContent, { 
                    transform: [{ 
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                      }) 
                    }] 
                  }]}
                >
                  <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>

                  {selectedDate && events[selectedDate] && events[selectedDate].events.length > 0 ? (
                    <View>
                      <Text style={styles.modalTitle}>Eventos para {selectedDate}</Text>
                      <ScrollView style={styles.eventsScroll}>
                        {events[selectedDate].events.map((event) => (
                          <Animated.View 
                            key={event.key} 
                            style={styles.eventItem}
                            entering={Animated.FadeInDown}
                            exiting={Animated.FadeOutUp}
                          >
                            <Text style={styles.eventText}>{event.title}</Text>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => handleDeleteEvent(event.id)}
                            >
                              <Ionicons name="trash-outline" size={24} color="white" />
                            </TouchableOpacity>
                          </Animated.View>
                        ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.modalTitle}>Agregar Evento para {selectedDate}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Nuevo evento"
                        placeholderTextColor="#999"
                        value={title}
                        onChangeText={setTitle}
                      />
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddEvent}
                      >
                        <Text style={styles.addButtonText}>Agregar Evento</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              </BlurView>
            </Modal>
          </>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  eventsScroll: {
    maxHeight: 300,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  eventText: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: 'rgba(231,76,60,0.8)',
    padding: 10,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    fontSize: 18,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'white',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default CalendarScreen;