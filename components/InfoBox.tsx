import { View, Text } from "react-native";
import React from "react";

type InfoBoxTypes = {
  title: string | number;
  subtitle?: string;
  containerStyles?: string;
  textStyles?: string;
};

const InfoBox = ({ title, subtitle, containerStyles, textStyles }: InfoBoxTypes) => {
  return (
    <View className={`justify-center items-center ${containerStyles}`}>
      <Text
        className={`text-white font-psemibold -mb-1 ${textStyles} `}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-gray-400 text-sm">{subtitle}</Text>
      ) : null}
    </View>
  );
};

export default InfoBox;
