import { config } from '@tamagui/config/v3'
import { createTamagui, createTokens } from 'tamagui'

const size = {
  0: 0,
  1: 5,
  2: 10,
  true: 10,
  // ....
}

const tokens = createTokens({
  size : size, // Define size tokens if needed
  color: {
    white: '#ffffff',
    black: '#000000',
    primary1: '#381fd1',
    primary2: '#381fd1'
  },
  space:{ ...size, '-1': -5, '-2': -10 }, // Define space tokens if needed
  radius: { 0: 0, 1: 3 }, // Define radius tokens if needed
  zIndex: { 0: 0, 1: 100, 2: 200 }, // Define zIndex tokens if needed
});

export const tamaguiConfig = createTamagui({
  config,
  tokens,
  themes: {
    light: {
      bg: tokens.color.white,
      color: tokens.color.primary1,
    },
    dark: {
      bg: tokens.color.black,
      color: tokens.color.primary2,
    },
  },
})
export default tamaguiConfig
export type Conf = typeof tamaguiConfig
declare module 'tamagui' {

  interface TamaguiCustomConfig extends Conf {}

}