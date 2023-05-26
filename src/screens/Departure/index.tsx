import { useState } from "react";
import { ScrollView, TextInput, View, findNodeHandle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Button } from "../../components/Button";

import { Container, Content } from "./styles";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextAreaInput } from "../../components/TextAreaInput";
import { Header } from "../../components/Header";

export function Departure() {
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRegistering, setIsResgistering] = useState(false);

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={24} enableOnAndroid>
        <View>
          <Content>
            <LicensePlateInput
              label="Placa do veículo"
              placeholder="BRA1234"
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              label="Finalizade"
              placeholder="Vou utilizar o veículo para..."
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button title="Registar Saída" isLoading={isRegistering} />
          </Content>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}
