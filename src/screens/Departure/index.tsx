import { useNavigation } from '@react-navigation/native'
import { useUser } from '@realm/react'
import * as Location from 'expo-location'
import { useRef, useState } from 'react'
import { Alert, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { TextAreaInput } from '../../components/TextAreaInput'
import { useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { licensePlateValidate } from '../../utils/licensePlateValidate'
import { Container, Content } from './styles'

export function Departure() {
  const { goBack } = useNavigation()
  const realm = useRealm()
  const user = useUser()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsResgistering] = useState(false)

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informa a placa correta.',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo',
        )
      }

      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Erro',
          'Não foi possível obter a localização do dispositivo.',
        )
        return
      }

      const location = await Location.getCurrentPositionAsync({})

      console.log(location)

      setIsResgistering(false)

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate,
            description,
          }),
        )
      })

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso.')

      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não possível registrar a saída do veículo.')
      setIsResgistering(false)
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={24} enableOnAndroid>
        <View>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              returnKeyType="next"
              onChangeText={setLicensePlate}
              onSubmitEditing={() => {
                descriptionRef.current?.focus()
              }}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalizade"
              placeholder="Vou utilizar o veículo para..."
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
              onSubmitEditing={handleDepartureRegister}
            />

            <Button
              title="Registar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  )
}
