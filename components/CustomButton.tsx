import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyle?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton = ({
  title,
  handlePress,
  containerStyle,
  textStyles,
  isLoading,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyle} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-base ${textStyles}`}>
        {isLoading ? <ActivityIndicator /> : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
