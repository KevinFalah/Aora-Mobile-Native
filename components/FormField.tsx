import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

type FormFieldTypes = {
  title: string;
  value?: any;
  handleChangeText: (val: string) => void;
  otherStyle?: string;
  keyboardType?: string;
  placeholder?: string;
};

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyle,
  keyboardType,
  placeholder,
}: FormFieldTypes) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyle}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full min-h-[60px] bg-black-100 border-black-200 rounded-xl focus:border-secondary border-2 flex-row items-center px-3">
        <TextInput
          className="font-psemibold flex-1 text-white"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" ? (
          <TouchableOpacity activeOpacity={0.6} onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default FormField;
