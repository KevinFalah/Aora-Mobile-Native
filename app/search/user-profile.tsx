import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getUserPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import InfoBox from "@/components/InfoBox";

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
  userLiked: string[];
}

type RenderHeaderTypes = {
  avatar: string;
  username: string;
  totalPosts: number;
  totalLike: number;
};

const RenderHeader = ({
  avatar,
  username,
  totalPosts,
  totalLike,
}: RenderHeaderTypes) => (
  <View className="px-3 pb-10">
    <View className=" justify-center items-center pt-20">
      <View className="border border-secondary-100 rounded-lg">
        <Image
          source={{ uri: avatar }}
          className="w-16 h-16 rounded-lg"
          resizeMode="cover"
        />
      </View>

      <Text className="text-white font-psemibold text-lg mt-2">{username}</Text>
    </View>
    <View className="flex-row justify-center mt-3">
      <InfoBox
        title={totalPosts}
        subtitle="Posts"
        containerStyles="mr-10"
        textStyles="text-lg"
      />
      <InfoBox title={totalLike} subtitle="Likes" textStyles="text-lg" />
    </View>
  </View>
);

const UserProfile = () => {
  const { id, username, avatar } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const userId = typeof id == "string" ? id : "";
  const _avatar = typeof avatar == "string" ? avatar : "";
  const _username = typeof username == "string" ? username : "";

  const {
    data: postsData,
    isLoading,
    refetch,
  } = useAppwrite<IPost>(() => getUserPosts(userId));

  const totalLikedVideo = () => {
    const result = postsData.reduce(
      (total, curr) => (total += curr.userLiked.length),
      0
    );
    return result;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={postsData || []}
        renderItem={({ item }) => <VideoCard videoData={item} />}
        keyExtractor={(item) => item?.$id}
        ListHeaderComponent={() => (
          <RenderHeader
            avatar={_avatar || ""}
            username={_username || ""}
            totalPosts={postsData?.length || 0}
            totalLike={totalLikedVideo()}
          />
        )}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default UserProfile;
