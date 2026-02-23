import * as DocumentPicker from "expo-document-picker";

export default async function useDocumentPicker(
  options?: DocumentPicker.DocumentPickerOptions,
  maxSelection = 4,
) {
  // No permissions request is necessary for launching the document picker
  let result = await DocumentPicker.getDocumentAsync({
    ...options,
  });

  if (!result.canceled) {
    if (result.assets.length > maxSelection) {
      // showToast({
      //   title: "Too many files",
      //   message: `Maximum file allowed is ${maxSelection}`,
      //   type: "info",
      // });
      return null;
    }
    return result.assets;
  } else {
    return null;
  }
}
