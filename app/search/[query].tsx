import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

interface ICreator {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $tenant: string;
  $updatedAt: string;
  accountId: string;
  avatar: string;
  email: string;
  username: string;
}

interface IPost {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $tenant: string;
  $updatedAt: string;
  creator: ICreator;
  prompt: string;
  thumbnail: string;
  title: string;
  video: string;
  userLiked: string[]
}

type RenderHeaderTypes = {
  query: string | number;
};

const RenderHeader = ({ query }: RenderHeaderTypes) => (
  <View className="px-3 pb-10">
    <View className="my-10 flex-row items-center justify-between space-y-6">
      <View>
        <Text className="text-sm font-pmedium text-white">Search Result</Text>
        <Text className="text-2xl font-psemibold text-white">{query}</Text>
      </View>
      <Image
        source={images.logoSmall}
        resizeMode="contain"
        className="w-10 h-10"
      />
    </View>

    <SearchInput initialQuery={query} />
  </View>
);

const Search = () => {
  const { query } = useLocalSearchParams();
  const _query = Array.isArray(query) ? query[0] : query || "";
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useAppwrite<IPost>(() => searchPosts(_query));
  console.log(isLoading, "<- loa");
  useEffect(() => {
    refetch();
  }, [query]);
  console.log(postsData, query, "<- postsData");
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={postsData || []}
        renderItem={({ item }) => <VideoCard videoData={item} />}
        keyExtractor={(item) => item?.$id}
        ListHeaderComponent={() => <RenderHeader query={_query} />}
        ListEmptyComponent={() => {
          if (isLoading) {
            return <ActivityIndicator />;
          }

          return (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found for this search value"
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Search;
