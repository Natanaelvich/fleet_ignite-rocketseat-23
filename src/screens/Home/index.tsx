import { HomeHeader } from "../../components/HomeHeader";

import { Container, Content, Title } from "./styles";

export function Home() {
  return (
    <Container>
      <HomeHeader />

      <Content>
        <Title>Histórico</Title>
      </Content>
    </Container>
  );
}
