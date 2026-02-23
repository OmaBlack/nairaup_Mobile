import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import { Input, SelectInput } from "src/components/inputs.components";
import { ResponseModal } from "../apartments/components/modal.components";
import { Modalize } from "react-native-modalize";
import useJobs from "src/hooks/apis/useJobs";
import { useGetJobTypesAndModesQuery } from "src/services/redux/apis/unauth.api.requests";
import { JobworkModeType, JobworkType } from "src/types/jobs.types";

export default function JobCreateNextScreen({
  navigation,
  route,
}: RootStackScreenProps<"JobCreateNextScreen">) {
  const modalRef = useRef<Modalize>(null);
  const { isFetching, data } = useGetJobTypesAndModesQuery(null);
  const { loading, createJob } = useJobs();
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [workMode, setWorkMode] = useState<JobworkModeType>("onsite");
  const [workType, setWorkType] = useState<JobworkType>("fulltime");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");

  const doSubmit = async () => {
    const req = await createJob({
      role,
      address,
      city: "ikeja",
      company,
      description,
      maxsalary: salary,
      minsalary: salary,
      qualifications: [qualifications],
      requirements: [requirements],
      state: "lagos",
      workmode: workMode,
      worktype: workType,
    });
    if (req.code === 201) modalRef.current?.open();
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Input label="Position" value={role} onChangeText={setRole} />
          <Input label="Location" value={address} onChangeText={setAddress} />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            inputHeight={fontUtils.h(80)}
          />
          <Input
            label="Requirements"
            value={requirements}
            onChangeText={setRequirements}
            multiline
            inputHeight={fontUtils.h(80)}
          />
          <Input
            label="Qualifications"
            value={qualifications}
            onChangeText={setQualifications}
            multiline
            inputHeight={fontUtils.h(80)}
          />
          <Text mb={fontUtils.h(10)}>Work mode</Text>
          <SelectInput
            items={data?.data?.modes || []}
            value={workMode}
            onSelectItem={(e: any) => setWorkMode(e.value)}
            loading={isFetching}
            listMode="MODAL"
            wrapperStyle={styles.selectWrapperStyle}
          />
          <Text mb={fontUtils.h(10)}>Work Type</Text>
          <SelectInput
            items={data?.data?.types || []}
            value={workType}
            onSelectItem={(e: any) => setWorkType(e.value)}
            loading={isFetching}
            listMode="MODAL"
            wrapperStyle={styles.selectWrapperStyle}
          />
          <Input label="Company" value={company} onChangeText={setCompany} />
          <Input
            label="Renumeration"
            value={salary}
            onChangeText={setSalary}
            keyboardType="number-pad"
          />
        </View>
        <Button
          title={"Submit"}
          onPress={doSubmit}
          loading={loading}
          disabled={
            role === "" || company === "" || salary === "" || Number(salary) < 0
          }
          wrapperStyle={{ marginTop: fontUtils.h(20) }}
        />
      </ScrollView>
      <ResponseModal
        title="Update Successful"
        note={`Your job listing for ${role} has been submitted successfully. Keep checking your notifications for update on applications.\nThank you`}
        modalRef={modalRef}
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
