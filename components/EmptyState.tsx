import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

type EmptyStateProps = {
  title: string;
  subtitle: string;
  needBtn?: boolean;
};

const EmptyState = ({ title, subtitle, needBtn = true }: EmptyStateProps) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />

      <Text className="text-xs font-pmedium text-gray-300">{title}</Text>
      <Text className="text-center font-psemibold text-white">{subtitle}</Text>

      {needBtn ? (
        <CustomButton
          title="Create video"
          handlePress={() => router.push("/create")}
          containerStyle="w-full my-5"
        />
      ) : null}
    </View>
  );
};

export default EmptyState;
