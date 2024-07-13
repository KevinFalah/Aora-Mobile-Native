import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "react-native";
import { icons } from "@/constants";
import { Video, ResizeMode } from "expo-av";

interface IPostsItems {
  [key: string]: any;
}

type TrendingTypes = {
  posts: IPostsItems[];
};

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

type TrendingItemTypes = {
  activeItem: string;
  item: IPost;
};

const zoomIn = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }: TrendingItemTypes) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [play, setPlay] = useState(false);

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: activeItem === item.$id ? 1.1 : 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [activeItem]);

  console.log(item?.video, '<- ')
  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className="mr-2"
    >
      {play ? (
        <Video
          className="w-52 h-72 rounded-lg mt-3 bg-white/10"
          source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          useNativeControls
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => {
            if (status?.didJustFinish) {
              setPlay(false)
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className={`justify-center items-center relative`}
          activeOpacity={0.6}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item?.thumbnail }}
            className="shadow-black w-52 h-72 overflow-hidden shadow-lg rounded-lg my-5"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="absolute w-8 h-8"
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const Trending = ({ posts }: TrendingTypes) => {
  const [activeItem, setActiveItem] = useState<string>(posts[0]?.$id);

  const viewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0]?.key);
    }
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item as IPost} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
      className="transition-all duration-500 "
      horizontal
    />
  );
};

export default Trending;
