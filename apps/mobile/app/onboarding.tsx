import {
  Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, View, Pressable, Keyboard,
} from "react-native";
import {useState} from "react";
import {Picker} from '@react-native-picker/picker';
import {Link, useRouter} from "expo-router";
import {UserSettings} from "@/src/hooks/user/user-settings.type";
import {useUserSettings} from "@/src/hooks/user/use-user-settings";
import {Checkbox} from "expo-checkbox";

import * as Notifications from 'expo-notifications';
import {ThemedText} from "@/src/components/themed-text";
import {ThemedView} from "@/src/components/themed-view";
import { ArrowRight } from "lucide-react-native";
// Handler au niveau module (pas dans une fonction)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Onboarding() {
  const { savePreferences } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const router = useRouter();

  const [userPref, setUserPref] = useState<UserSettings>({
    name: '',
    seriesPerExercise: 4,
    repPerSeries: 12,
    restBetweenSeries:90,
    isOnboarded: true,
    notifications: false,
  })
  const handleSave = async () => {
    setIsLoading(true);
    savePreferences({...userPref, isOnboarded: true, name: userPref.name.trim() ?? ''});
    setIsLoading(false);
    router.replace('/(tabs)');
  };

  const handleChange = (key: string, value: number) => {
    setUserPref((prev) => ({...prev, [key]: value}))
  }

  async function notif() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission notifications refusée');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up!",
        body: 'Change sides!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });
  }
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <Pressable onPress={Keyboard.dismiss}>
          <ThemedView style={styles.container}>
        <ThemedView>
          <ThemedText type='title'>Configurez votre profil</ThemedText>
          <ThemedText>Personnalisez votre expérience pour atteindre vos objectifs plus rapidement.</ThemedText>
        </ThemedView>
          <ThemedView>

        <ThemedText type='label'>NOM</ThemedText>
        <TextInput
          style={styles.input}
          spellCheck={false}
          placeholderTextColor='#94A3B8'
          placeholder="Choississez un nom"
          onChangeText={(event) => setUserPref((prev) => { return {...prev, name: event}}) }
        />
          </ThemedView>
        <ThemedView style={styles.groupInput}>
          <ThemedView style={styles.groupInputItem}>
            <ThemedText type='label'>Séries</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="4"
              keyboardType="numeric"
              placeholderTextColor='#94A3B8'
              onChangeText={(event) => handleChange('seriesPerExercise', Number(event)) }
            />
            <ThemedText style={{ color: '#FF5724'}}>Défaut</ThemedText>
          </ThemedView>
          <ThemedView style={styles.groupInputItem}>
            <ThemedText type='label'>Répétition</ThemedText>
            <TextInput
              style={styles.input}
              placeholderTextColor='#94A3B8'
              placeholder="12"
              keyboardType="phone-pad"
              onChangeText={(event) => handleChange('repPerSeries', Number(event)) }
            />
            <ThemedText style={{ color: '#FF5724'}}>Défaut</ThemedText>
          </ThemedView>
        </ThemedView>
        <View style={styles.section}>
          <Checkbox
            value={userPref.notifications}
            onValueChange={async () => {
              if (!userPref.notifications) {
                const { status } = await Notifications.requestPermissionsAsync();
                setUserPref((prev) => ({ ...prev, notifications: status === 'granted' }));
              } else {
                setUserPref((prev) => ({ ...prev, notifications: false }));
              }
            }}
            color='rgb(255,87,36, 0.8)'
          />
          <ThemedText>Autoriser les notifications</ThemedText>
        </View>

        <TouchableOpacity style={styles.pickerButton} onPress={() => setIsPickerVisible(true)}>
          <Text style={styles.pickerButtonLabel}>Repos entre les séries</Text>
          <Text style={styles.pickerButtonValue}>{userPref.restBetweenSeries} sec</Text>
        </TouchableOpacity>

        <Modal
          visible={isPickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsPickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsPickerVisible(false)} />
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Repos entre les séries</Text>
                <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                  <Text style={styles.pickerDone}>Valider</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={userPref.restBetweenSeries}
                onValueChange={(value) => handleChange('restBetweenSeries', value)}
              >
                <Picker.Item label="30 sec" value={30} />
                <Picker.Item label="1min" value={60} />
                <Picker.Item label="1min 30s" value={90} />
                <Picker.Item label="2 min" value={120} />
                <Picker.Item label="2 min" value={120} />
                <Picker.Item label="3 min" value={180} />
              </Picker>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Checkbox
            value={userPref.acceptedTerms} onValueChange={() => setUserPref((prev) => { return {...prev, acceptedTerms: !prev.acceptedTerms}}) }
            color='rgb(255,87,36, 0.8)'
          />
          <ThemedText>J&#39;accepte les <Link style={{ color: '#FF5724', wordWrap: 'break-word'}} href="/CGU">Conditions Générales d&#39;Utilisation (CGU)</Link></ThemedText>
        </View>

          <TouchableOpacity disabled={!userPref.acceptedTerms} onPress={handleSave}>
            <View style={!userPref.acceptedTerms ? styles.disable : styles.button}>
              <Text style={styles.textButton}>Continuer</Text>
              <ArrowRight color='#fff' />
            </View>
          </TouchableOpacity>
        </ThemedView>
        </Pressable>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginVertical: 12,
    gap: 12,
  },
  groupInput: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  groupInputItem: {
    flex: 1,
  },
  input: {
    height: 56,
    marginVertical: 10,
    borderColor: 'rgb(255,87,36, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Lexend',
    color: '#94A3B8',
    padding: 8,
    backgroundColor: '#fff',
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },
  button: {
    textAlign: 'center',
    height: 60,
    backgroundColor: '#FF5724',
    borderRadius: 12,
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 10px 15px -3px rgba(255,87,36, 0.2)',
  },
  disable: {
    textAlign: 'center',
    height: 60,
    backgroundColor: 'rgba(122,121,121,0.8)',
    borderRadius: 12,
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 10px 15px -3px rgba(94,93,93,0.8)',
  },
  textButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    borderColor: 'rgb(255,87,36, 0.2)',
    borderWidth: 1,
    padding: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  pickerButtonLabel: {
  },
  pickerButtonValue: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerDone: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

