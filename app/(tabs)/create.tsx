import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

interface IDocumentPickerAssets {
  mimeType: string;
  name: string;
  size: number;
  uri: string;
}
interface IFormState {
  title: string;
  video: IDocumentPickerAssets | null;
  thumbnail: IDocumentPickerAssets | null;
  prompt: string;
}

const initialForm = {
  title: "",
  video: null,
  thumbnail: null,
  prompt: "",
};

const Create = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState<IFormState>(initialForm);
  const [uploading, setUploading] = useState(false);

  const submit = async () => {
    if (!form.title || !form.prompt || !form.thumbnail || !form.video) {
      return Alert.alert("Please fill in all the fields");
    }
    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user?.$id || "",
      });

      Alert.alert("Sucess", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setForm(initialForm);
      setUploading(false);
    }
  };

  const isLessThanMB = (fileSize: number, smallerThanSizeMB: number) => {
    const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB;
    return isOk;
  };

  const openPicker = async (selectType: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) return;

    const { fileSize, mimeType, fileName, uri } = result.assets?.[0];

    const asset = {
      mimeType: mimeType || "",
      uri: uri || "",
      name: fileName || "",
      size: fileSize || 0,
    };

    const isLt50MB = isLessThanMB(asset.size, 50);

    if (!isLt50MB) {
      alert(`Size must be smaller than 50MB!`);
      return;
    }

    if (selectType === "image") {
      setForm({ ...form, thumbnail: asset });
    } else if (selectType === "video") {
      setForm({ ...form, video: asset });
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-10">
        <Text className="text-white text-xl font-psemibold">Upload Video</Text>

        <View className="mt-8 space-y-2">
          <FormField
            title="Video Title"
            value={form.title}
            handleChangeText={(e) => setForm({ ...form, title: e })}
            placeholder="Give your video a title.."
            otherStyle="mb-6"
          />

          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity
            className="mb-6"
            onPress={() => openPicker("video")}
          >
            {form.video ? (
              <Video
                source={{ uri: form.video?.uri }}
                resizeMode={ResizeMode.CONTAIN}
                className="w-full h-40"
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-8 h-8"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-base text-gray-100 font-pmedium mt-5">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail?.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-xl"
              />
            ) : (
              <View className="w-full h-32 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <FormField
            title="AI Prompt"
            value={form.prompt}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            placeholder="The prompt you used to create this video"
            otherStyle="mt-6 mb-10"
          />

          <CustomButton
            title="Submit & Publish"
            isLoading={uploading}
            handlePress={submit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
