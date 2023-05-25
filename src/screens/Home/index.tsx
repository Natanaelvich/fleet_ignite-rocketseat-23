import { useCallback, useEffect, useState } from "react";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";
import { HomeHeader } from "../../components/HomeHeader";
import { useQuery } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import { Container, Content, Label, Title } from "./styles";
import { Alert, FlatList } from "react-native";

export function Home() {
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );

  const historic = useQuery(Historic);

  const fetchHistoric = useCallback(() => {
    try {
      const response = historic.filtered(
        "status='arrival' SORT(created_at DESC)"
      );
      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: item.created_at.toString(),
        };
      });
      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      console.log(error);
      Alert.alert("Histórico", "Não foi possível carregar o histórico.");
    }
  }, [historic]);

  useEffect(() => {
    fetchHistoric();
  }, []);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <Title>Histórico</Title>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoricCard data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nenhum registro de utilização.</Label>}
        />
      </Content>
    </Container>
  );
}
