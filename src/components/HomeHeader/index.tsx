import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container, Greeting, Message, Name, Picture } from "./styles";

import theme from "../../theme";
import { Power } from "phosphor-react-native";

export function HomeHeader() {
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 32;

  return (
    <Container style={{ paddingTop }}>
      <Picture
        source={{ uri: "https://github.com/natanaelvich.png" }}
        placeholder="L184i9ofbHof00ayjsay~qj[ayj@"
      />
      <Greeting>
        <Message>Olá</Message>

        <Name>Natanael</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}
