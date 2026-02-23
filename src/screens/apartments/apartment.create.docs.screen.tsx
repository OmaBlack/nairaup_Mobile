import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import layoutConstants from "src/constants/layout.constants";
import { Octicons } from "@expo/vector-icons";
import { colorPrimary } from "src/constants/colors.constants";
import { Modalize } from "react-native-modalize";
import { ResponseModal } from "./components/modal.components";
import useDocumentPicker from "src/hooks/useDocumentPicker";
import useProperties from "src/hooks/apis/useProperties";
import { useFileUpload } from "src/hooks/apis/useFIle";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { CreateFileName, GetMediaType } from "src/utils/file.utils";

export default function ApartmentCreateDocsScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentCreateDocsScreen">) {
  const type = route.params.type;
  const data = route.params.data;

  const { profile } = useAppSelector((state) => state.auth.user);

  const { loading, createProperty } = useProperties();
  const { loading: uploading, uploadFile } = useFileUpload();
  const [propertyId, setPropertyId] = useState(-1);

  const [docs, setDocs] = useState(
    data.type === "apartment"
      ? {
          deed: {
            doc: {},
            title: "Title Deed/Certificate of Occupancy",
          },
          issuedid: {
            doc: {},
            title: "Government Issued ID",
          },
          powerofattorny: {
            doc: {},
            title: "Power of Attorny (Listing as Agent)",
          },
          tenancyagreement: {
            doc: {},
            title: "Tenancy Agreement",
          },
          buildingapproval: {
            doc: {},
            title: "Building Approval (If any)",
          },
        }
      : {
          coincorporation: {
            doc: {},
            title: "Certificate of Incorporation",
          },
          license: {
            doc: {},
            title: "Hotel License or Tourism Board Registration",
          },
          proofofownership: {
            doc: {},
            title: "Proof of Ownership",
          },
          cacdocs: {
            doc: {},
            title: "CAC Documents",
          },
        },
  );

  const disableBtn = useMemo(() => {
    let disable = true;
    for (const key in docs) {
      //@ts-ignore
      if (docs[key].doc?.uri) {
        disable = false;
        break;
      }
    }
    return disable;
  }, [docs]);

  const doPickDocument = (key: string) => {
    useDocumentPicker({
      type: "application/pdf",
    }).then((doc) => {
      if (doc && doc.length > 0)
        setDocs({
          ...docs,
          [key]: {
            //@ts-ignore
            ...docs[key],
            doc: doc[0],
          },
        });
    });
  };

  const uploadImages = async () => {
    const urls = [];
    const images = route.params.data.images;
    for (const img of images) {
      const formData = new FormData();
      formData.append("path", `${type}s/${profile.id}`);
      //@ts-ignore
      formData.append("file", {
        name: CreateFileName(`${img?.uri}`),
        type: GetMediaType(`${img?.uri}`) || `image/jpeg`,
        uri: img?.uri,
      });
      const req = await uploadFile(formData, true);
      if (req.code === 200 && req.data.Location) urls.push(req.data.Location);
    }
    return urls;
  };

  const uploadDocuments = async () => {
    const _docs: {
      title: string;
      documenturl: string;
    }[] = [];
    for (const key in docs) {
      //@ts-ignore
      if (docs[key].doc?.uri) {
        const formData = new FormData();
        formData.append("path", `${type}s/${profile.id}`);
        //@ts-ignore
        formData.append("file", {
          //@ts-ignore
          name: CreateFileName(`${docs[key].doc?.uri}`),
          //@ts-ignore
          type: GetMediaType(`${docs[key].doc?.uri}`) || `application/pdf`,
          //@ts-ignore
          uri: docs[key].doc?.uri,
        });
        const req = await uploadFile(formData, true);
        if (req.code === 200 && req.data.Location)
          _docs.push({
            documenturl: req.data.Location,
            //@ts-ignore
            title: docs[key].title,
          });
      }
    }
    return _docs;
  };

  const modalRef = useRef<Modalize>(null);
  const doSumbit = async () => {
    const images = await uploadImages();
    const documents = await uploadDocuments();
    const req = await createProperty({
      address: data.address,
      category: data.category,
      city: `${data.city}`,
      description: data.description,
      documents,
      featuredimageurl: images.length > 0 ? images[0] : undefined,
      featureids: data.features,
      geocode: `${data.geolocation}`,
      imageurls:
        images.length > 1
          ? images.slice(1).toString()
          : images.length === 1
          ? images[0]
          : undefined,
      landmark: "",
      price: data.price !== "" ? data.price : undefined,
      state: `${data.state}`,
      title: data.title,
      type: data.type,
    });
    if (req.code === 201) {
      setPropertyId(req?.data?.id);
      modalRef.current?.open();
    }
  };

  const doCloseModal = () => {
    if (data.type === "apartment") navigation.popTo("App");
    else
      navigation.replace("ApartmentRoomsAddScreen", {
        id: propertyId,
        title: data.title,
      });
  };

  // const disableBtn = useMemo(() => {
  //   if (type === "apartment") return !cofO?.uri;
  // }, [type, cofO]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView style={{ flex: 1 }}>
        {Object.keys(docs).map((key) => {
          return (
            <View key={key}>
              <Text mt={fontUtils.h(20)} mb={fontUtils.h(10)}>
                {
                  //@ts-ignore
                  `Upload ${data.type} ${docs[key].title}`
                }
              </Text>
              <View style={[layoutConstants.styles.rowView]}>
                <TouchableOpacity
                  onPress={() => doPickDocument(key)}
                  style={layoutConstants.styles.uploadBtnStyle}
                >
                  <Octicons
                    name="upload"
                    size={fontUtils.h(15)}
                    color={colorPrimary}
                  />
                  <Text
                    mt={fontUtils.h(5)}
                    size={fontUtils.h(10)}
                    align="center"
                  >
                    Select PDF to upload
                  </Text>
                </TouchableOpacity>
                {
                  //@ts-ignore
                  docs[key].doc?.uri ? (
                    <Text ml={fontUtils.w(20)} size={fontUtils.h(10)}>
                      1 file selected
                    </Text>
                  ) : null
                }
              </View>
            </View>
          );
        })}
      </ScrollView>
      {/* <View style={{ flex: 1 }}>
          <Text mb={fontUtils.h(10)}>Number of rooms</Text>
          <SelectInput
            items={[]}
            value={""}
            wrapperStyle={styles.selectWrapperStyle}
          />
          <Text mb={fontUtils.h(10)}>Room features</Text>
          <SelectInput
            items={[]}
            value={""}
            wrapperStyle={styles.selectWrapperStyle}
          />
          <Text mb={fontUtils.h(10)}>Room location</Text>
          <SelectInput
            items={[]}
            value={""}
            wrapperStyle={styles.selectWrapperStyle}
          />
          <Text mb={fontUtils.h(10)}>Room description</Text>
          <SelectInput
            items={[]}
            value={""}
            wrapperStyle={styles.selectWrapperStyle}
          />
          <Input label="Enter price per night" keyboardType="number-pad" />
          <Text mb={fontUtils.h(10)}>Upload room photos</Text>
          <View style={[layoutConstants.styles.rowView]}>
            <TouchableOpacity style={layoutConstants.styles.uploadBtnStyle}>
              <Octicons
                name="upload"
                size={fontUtils.h(15)}
                color={colorPrimary}
              />
              <Text mt={fontUtils.h(5)} size={fontUtils.h(10)} align="center">
                Select photo to upload
              </Text>
            </TouchableOpacity>
            <Text ml={fontUtils.w(20)} size={fontUtils.h(10)}>
              1 file selected
            </Text>
          </View>
        </View> */}
      <Button
        title={"Submit"}
        onPress={doSumbit}
        loading={loading || uploading}
        disabled={disableBtn}
        wrapperStyle={{ marginTop: fontUtils.h(20) }}
      />
      <ResponseModal
        note={
          data.type === "hotel"
            ? "Would you like to add rooms to the hotel now?"
            : undefined
        }
        btnTitle={data.type === "hotel" ? "Yes" : undefined}
        modalRef={modalRef}
        onClose={doCloseModal}
        onCancel={() => {
          modalRef.current?.close();
          navigation.popTo("App");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: fontUtils.h(20),
  },
  selectWrapperStyle: {
    marginBottom: fontUtils.h(20),
  },
});
