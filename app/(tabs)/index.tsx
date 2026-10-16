import {ThemedText} from '@/src/components/themed-text';
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemedView} from "@/src/components/themed-view";
import {FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Settings} from "lucide-react-native/icons";
import {useEffect, useState} from "react";
import {Template} from "@/src/repositories/template/template-type";
import {TemplateRepository} from "@/src/repositories/template/template-repository";
import {formatDate} from "@/src/utils/date";

export default function HomeScreen() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    const t = TemplateRepository.getAllTemplates();
    console.log(t);
    setTemplates(t)
  }

  const header = (
    <ThemedView>
      <Pressable onPress={() => console.log(1)}>
        <Settings size={32}/>
      </Pressable>
      <View>
        <ThemedText type='title'>Mes Templates</ThemedText>
        <ThemedText>voir tout</ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <SafeAreaView style={{flex: 1, padding: 16}}>
      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        renderItem={({item}) => (
          <ThemedView style={styles.template}>
            <View style={styles.header}>
              <View>
                <ThemedText type='subtitle'>{item.name}</ThemedText>
                <ThemedText>- {item.updated_at && formatDate(item.updated_at)}</ThemedText>
              </View>
              <View>
                <ThemedText>{formatDate(item.created_at)}</ThemedText>
              </View>
            </View>
            <TouchableOpacity>
              <View style={styles.button}>
                <Text>Go</Text>
              </View>
            </TouchableOpacity>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  template: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
})
