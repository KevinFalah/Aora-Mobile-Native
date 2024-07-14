import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons, images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { getUserPosts, signOut } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
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
}

type RenderHeaderTypes = {
  avatar: string;
  username: string;
  totalPosts: number;
  logOut: () => void;
};

const RenderHeader = ({ avatar, username, totalPosts, logOut }: RenderHeaderTypes) => (
  <View className="px-3 pb-10">
    <View className="mb-4 mt-14 flex-row items-center justify-end space-y-6">
      <TouchableOpacity activeOpacity={0.6} onPress={logOut}>
        <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>
    </View>
    <View className=" justify-center items-center">
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
      <InfoBox title={totalPosts} subtitle="Posts" containerStyles="mr-10" textStyles="text-lg" />
      <InfoBox title="1.3k" subtitle="Views" textStyles="text-lg"/>
    </View>
  </View>
);

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false)
  const userId = user?.$id ? user?.$id : "";
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useAppwrite<IPost>(() => getUserPosts(userId));

  const logOut = async() => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)

    router.replace('/sign-in')
  }

  const onRefresh = async() => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  console.log(user, '<- user')
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={postsData || []}
        renderItem={({ item }) => <VideoCard videoData={item} />}
        keyExtractor={(item) => item?.$id}
        ListHeaderComponent={() => (
          <RenderHeader
            avatar={user?.avatar || ""}
            username={user?.username || ""}
            totalPosts={postsData?.length || 0}
            logOut={logOut}
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Profile;
