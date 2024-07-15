import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { icons } from "@/constants";
import { Video, ResizeMode } from "expo-av";
import { likedVideo } from "@/lib/appwrite";
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
  userLiked: string[];
}

type VideoCardType = {
  videoData: IPost;
  refetch?: () => void;
};

const VideoCard = ({ videoData, refetch }: VideoCardType) => {
  const {
    title,
    video,
    thumbnail,
    prompt,
    $id,
    userLiked,
    creator: { avatar, username },
  } = videoData;
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const savedVideo = async () => {
    const userId = user?.$id || "";
    setIsLoading(true);
    try {
      if (userId) {
        const userLikedSet = new Set(userLiked);
        userLikedSet.add(userId);
        const updatedUserLiked = Array.from(userLikedSet);

        await likedVideo($id, updatedUserLiked);

        if (typeof refetch === "function") {
          await refetch();
        }
      }
    } catch (error) {
      Alert.alert("Error", "Error Save Video");
    } finally {
      setIsLoading(false);
      setIsOpenComp(false);
    }
  };

  const unSavedVideo = async () => {
    const userId = user?.$id || "";
    setIsLoading(true);
    try {
      if (userId) {
        const updatedUserLiked = userLiked?.filter((id) => id !== user?.$id);
        await likedVideo($id, updatedUserLiked);
        if (typeof refetch === "function") {
          await refetch();
        }
      }
    } catch (error) {
      Alert.alert("Error", "Error Unsaved Video");
    } finally {
      setIsLoading(false);
      setIsOpenComp(false);
    }
  };

  const isAlreadySaved = useCallback(() => {
    const isSaved = userLiked.some((id) => id === user?.$id);

    if (isSaved) {
      return {
        title: "Unsaved",
        func: unSavedVideo,
      };
    }

    return {
      title: "Save",
      func: savedVideo,
    };
  }, [userLiked]);

  const [isOpenComp, setIsOpenComp] = useState(false);
  const [play, setPlay] = useState(false);

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

        <TouchableOpacity
          className="pt-2 relative z-[90]"
          activeOpacity={0.6}
          onPress={() => setIsOpenComp(!isOpenComp)}
        >
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          {isOpenComp ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={isAlreadySaved().func}
              className="bg-black-100 w-36 rounded-md absolute right-1 top-12 px-3 py-2"
              disabled={isLoading}
            >
              <Text className={`text-white font-pregular ${isLoading ? 'text-center' : 'text-left'}`}>
               {isLoading ? (<ActivityIndicator />) : isAlreadySaved().title}
              </Text>
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          useNativeControls
          className="w-full h-60 rounded-lg bg-white/10"
          onPlaybackStatusUpdate={(status) => {
            if (status?.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setPlay(true)}
          activeOpacity={0.6}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
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
