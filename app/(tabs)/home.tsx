import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";

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
}

type RenderHeaderTypes = {
  latestData: IPost[],
}

const RenderHeader = ({ latestData }: RenderHeaderTypes) => (
  <View className="px-3">
    <View className="my-10 flex-row items-center justify-between space-y-6">
      <View>
        <Text className="text-sm font-pmedium text-white">Welcome Back</Text>
        <Text className="text-2xl font-psemibold text-white">Kevin Falah</Text>
      </View>
      <Image
        source={images.logoSmall}
        resizeMode="contain"
        className="w-10 h-10"
      />
    </View>

    <SearchInput
    />

    <View className="w-full flex-1 pt-5 pb-8">
      <Text className="text-gray-400 text-sm font-pregular">
        Trending Videos
      </Text>

      <Trending posts={latestData ?? []} />
    </View>
  </View>
);

const Home = () => {
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useAppwrite<IPost>(getAllPosts);
  const {
    data: latestData,
    isLoading: isLoadingLatest,
  } = useAppwrite<IPost>(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
// console.log(postsData, '<- postsData')
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={postsData || []}
        renderItem={({ item }) => (
          <VideoCard videoData={item} />
        )}
        keyExtractor={(item) => item?.$id}
        ListHeaderComponent={() => <RenderHeader latestData={latestData} />}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
