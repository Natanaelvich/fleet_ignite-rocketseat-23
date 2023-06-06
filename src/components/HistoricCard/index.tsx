import { Check, ClockClockwise } from 'phosphor-react-native'
import { TouchableOpacityProps, ViewToken } from 'react-native'
import {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from 'styled-components/native'

import { Container, Departure, Info, LicensePlate } from './styles'

export type HistoricCardProps = {
  id: string
  licensePlate: string
  created: string
  isSync: boolean
}

type Props = TouchableOpacityProps & {
  data: HistoricCardProps
  viewableItems: SharedValue<ViewToken[]>
}

export function HistoricCard({ data, viewableItems, ...rest }: Props) {
  const { COLORS } = useTheme()

  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((item) => item.item.id === data.id),
    )

    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 500 }),
    }
  }, [viewableItems])

  return (
    <Container activeOpacity={0.7} {...rest} style={rStyle}>
      <Info>
        <LicensePlate>{data.licensePlate}</LicensePlate>

        <Departure>{data.created}</Departure>
      </Info>

      {data.isSync ? (
        <Check size={24} color={COLORS.BRAND_LIGHT} />
      ) : (
        <ClockClockwise size={24} color={COLORS.GRAY_400} />
      )}
    </Container>
  )
}
