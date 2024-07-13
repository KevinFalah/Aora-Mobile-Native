import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

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

type VideoCardType = {
  videoData: IPost;
};

const VideoCard = ({ videoData }: VideoCardType) => {
  const {
    title,
    video,
    thumbnail,
    prompt,
    creator: { avatar, username },
  } = videoData;

  const [play, setPlay] = useState(false)

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="rounded-lg w-full h-full"
              resizeMode="contain"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <TouchableOpacity className="pt-2" activeOpacity={0.6}>
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain"/>
        </TouchableOpacity>
      </View>

      {play ? (
        <Text className="text-white">Playing</Text>
      ): (
        <TouchableOpacity
        onPress={() => setPlay(true)}
        activeOpacity={.6} className="w-full h-60 rounded-xl mt-3 relative justify-center items-center">
          <Image 
            source={{uri: thumbnail}}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image 
          source={icons.play}
          className="w-10 h-10 absolute"
          resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
