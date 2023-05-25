import { useState } from "react";

import { useApp } from "@realm/react";

import { Container, Title, Slogan } from "./styles";

import backgroundImg from "../../assets/background.png";
import { Button } from "../../components/Button";

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const app = useApp();

  function handleGoogleSignIn() {
    setIsAuthenticating(true);
  }

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </Container>
  );
}
