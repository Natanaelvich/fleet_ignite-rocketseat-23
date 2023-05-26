import { useState } from "react";
import { ScrollView } from "react-native";

import { Button } from "../../components/Button";

import { Container, Content } from "./styles";
import { Header } from "react-native/Libraries/NewAppScreen";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextAreaInput } from "../../components/TextAreaInput";

export function Departure() {
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRegistering, setIsResgistering] = useState(false);

  return (
    <Container>
      <Header title="Saída" />

      <ScrollView>
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
      </ScrollView>
    </Container>
  );
}
