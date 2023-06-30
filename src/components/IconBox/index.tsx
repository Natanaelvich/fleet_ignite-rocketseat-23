import { IconProps } from 'phosphor-react-native'
import React from 'react'
import { useTheme } from 'styled-components'

import { Container, SizeProps } from './styles'

export type IconBoxProps = (props: IconProps) => React.ReactElement

type Props = {
  size?: SizeProps
  icon: IconBoxProps
}

export function IconBox({ icon: Icon, size = 'NORMAL' }: Props) {
  const iconSize = size === 'NORMAL' ? 24 : 16

  const { COLORS } = useTheme()

  return (
    <Container size={size}>
      <Icon size={iconSize} color={COLORS.BRAND_LIGHT} />
    </Container>
  )
}
