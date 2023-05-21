// import { useRouter } from "expo-router";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Text, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Feather";
import * as SecureStore from "expo-secure-store";

import NLWLogo from "../../src/assets/nlw-spacetime-logo.svg";
import { api } from "../../src/lib/api";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";

dayjs.locale(ptBr);

interface Memory {
  coverUrl: string;
  excerpt: string;
  createdAt: string;
  id: string;
}

export default function Memories() {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();

  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");

      const { data: memoriesList } = await api.get<Memory[]>("/memories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMemories(memoriesList);
    })();
  }, []);

  async function signOut() {
    SecureStore.deleteItemAsync("token");
    router.push("/");
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#FFF" />
          </TouchableOpacity>

          <Link href="/memories/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#FFF" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10 pb-8">
        {memories.map((memory) => (
          <View key={memory.id} className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />

              <Text className="font-body text-sm text-gray-100">
                {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
              </Text>
            </View>

            <View className="space-y-4 px-8">
              <Image
                source={{ uri: memory.coverUrl }}
                alt=""
                className="aspect-video w-full rounded-lg"
              />

              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>

              <Link href={`/memories/${memory.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ver mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
