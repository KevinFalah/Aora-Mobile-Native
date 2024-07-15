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
import { getVideosBySaved, searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

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
    <View className="my-10 flex-row items-center space-y-6">
        <Text className="text-white text-xl font-psemibold">Saved Videos</Text>
    </View>

    <SearchInput initialQuery={query} />
  </View>
);

const Bookmark = () => {
  const {user} = useGlobalContext();
  const userId = user?.$id || ''
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useAppwrite<IPost>(() => getVideosBySaved(userId));
  // const post
  // console.log(isLoading, "<- loa");
  
  return (
    <SafeAreaView className='bg-primary h-full'>
       <FlatList
        data={postsData || []}
        renderItem={({ item }) => <VideoCard videoData={item} refetch={refetch} />}
        keyExtractor={(item) => item?.$id}
        ListHeaderComponent={() => <RenderHeader query={''}  />}
        ListEmptyComponent={() => {
          if (isLoading) {
            return <ActivityIndicator />;
          }

          return (
            <EmptyState
              title="No Videos Found"
              subtitle="No one video you save"
              needBtn={false}
            />
          );
        }}
      />
    </SafeAreaView>
  )
}

export default Bookmark