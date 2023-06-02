import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import * as S from './styles'

const HistoricMap = () => {
  return (
    <S.Container>
      <MapView
        style={{
          width: '100%',
          height: '100%',
        }}
        provider={PROVIDER_GOOGLE}
      />
    </S.Container>
  )
}

export default HistoricMap
