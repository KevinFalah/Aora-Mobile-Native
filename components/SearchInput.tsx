import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

type SearchInputTypes = {
  initialQuery?: string | number;
  placeholder?: string;
  onSubmit?: (input: string | number) => void;
};

const SearchInput = ({
  initialQuery,
  placeholder,
  onSubmit,
}: SearchInputTypes) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const submitInput = () => {
    if (typeof onSubmit === "function") {
      onSubmit(query);
      return;
    }

    if (!query) {
      return Alert.alert(
        "Missing query",
        "Please input something to search result accross database"
      );
    }
    if (pathname.startsWith("/search")) router.setParams({ query });
    else router.push(`/search/${query}`);
  };

  return (
    <View className="w-full min-h-[60px] bg-black-100 border-black-200 rounded-xl focus:border-secondary border-2 flex-row items-center px-3 space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={placeholder ? placeholder : "Search for a video topic"}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity onPress={submitInput}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
