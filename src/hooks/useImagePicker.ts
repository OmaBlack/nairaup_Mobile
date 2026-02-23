import * as ImagePicker from "expo-image-picker";

export default async function useImagePicker(
  options?: ImagePicker.ImagePickerOptions,
) {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: false,
    presentationStyle: ImagePicker.UIImagePickerPresentationStyle.AUTOMATIC,
    allowsMultipleSelection: false,
    ...options,
  });

  if (!result.canceled) {
    return result.assets;
  } else {
    return null;
  }
}
