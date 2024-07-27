import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
  ImageGravity,
} from "react-native-appwrite";

interface ICreateUser {
  (email: string, password: string, username: string): any;
}

interface ISignIn {
  (email: string, password: string): any;
}

interface ICurrentUser {
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

interface IDocumentPickerAssets {
  mimeType: string;
  name: string;
  size: number;
  uri: string;
}
interface ICreateVideoForm {
  title: string;
  video: IDocumentPickerAssets | null;
  thumbnail: IDocumentPickerAssets | null;
  prompt: string;
  userId: string;
}

export const appwriteconfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "6689f1850012b36a359f",
  databaseId: "6689faf8002b0236dc03",
  userCollectionId: "6689fb1f003d6fff45a2",
  videoCollectionId: "6689fb56002f63c9d8c9",
  storageId: "668a736b003de1db1e57",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteconfig.endpoint)
  .setProject(appwriteconfig.projectId)
  .setPlatform(appwriteconfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser: ICreateUser = async (email, password, username) => {
  try {
    const newAccount = await account?.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    console.log("error create user =>", error);
    throw new Error(error);
  }
};

export const signIn: ISignIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    console.log("error sign in => ", error);
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log("error sign out", error);
  }
};

export const getCurrentUser = async (): Promise<ICurrentUser> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error("No current account");
    const currentUser = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error("No User Found");
    return currentUser.documents[0] as ICurrentUser;
  } catch (error) {
    console.log("error get current user => ", error);
    throw new Error();
  }
};

export const getAllPosts = async (): Promise<IPost[]> => {
  try {
    const post = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    return post.documents as IPost[];
  } catch (error) {
    console.log("error get all posts => ", error);
    throw new Error();
  }
};

export const getLatestPosts = async (): Promise<IPost[]> => {
  try {
    const post = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.videoCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(7)]
    );

    return post.documents as IPost[];
  } catch (error) {
    console.log("error latest posts => ", error);
    throw new Error;
  }
};

export const searchPosts = async (query: string): Promise<IPost[]> => {
  try {
    const post = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.videoCollectionId,
      [Query.search("title", query)]
    );

    return post.documents as IPost[];
  } catch (error) {
    console.log("error search posts => ", error);
    throw new Error;
  }
};

export const getUserPosts = async (userId: string): Promise<IPost[]> => {
  try {
    const post = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('$createdAt')]
    );

    return post.documents as IPost[];
  } catch (error) {
    console.log("error getUserPosts => ", error);
    throw new Error();
  }
};

const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteconfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteconfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.log("error get file preview => ", error);
    throw new Error;
  }
};

const uploadFile = async (file: IDocumentPickerAssets | null, type: string) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteconfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log("error upload file => ", error);
    throw new Error;
  }
};

export const createVideo = async (form: ICreateVideoForm) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.log("error create video => ", error);
    throw new Error;
  }
};

export const likedVideo = async (videoId: string, userLiked: string[]) => {
  try {
    const updatedSaved = await databases.updateDocument(
      appwriteconfig.databaseId,
      appwriteconfig.videoCollectionId,
      videoId,
      {
        userLiked
      }
    )
  } catch (error) {
    console.log('error liked video => ', error)
    throw new Error;
  }
}

export const getVideosBySaved = async (userId: string): Promise<IPost[]> => {
  try {
    const post = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.videoCollectionId,
      [Query.equal("userLiked", [userId]), Query.orderDesc('$createdAt')]
    );

    return post.documents as IPost[];
  } catch (error) {
    console.log('error get video by saved => ', error)
    throw new Error;
  }
}