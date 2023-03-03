import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    boxShadow: 'none',
    margin: 0,
    borderRadius: 0,
    px: '16px',
  },
  variants: {
    lcSquareBlue: defineStyle({
      bg: 'transparent',
      borderRadius: '8px',
      w: '40px',
      h: '40px',
      color: 'lc.light.icon.blue',
      _disabled: {
        cursor: 'not-allowed',
        opacity: 1,
        bg: 'none',
        color: 'lc.light.icon.disabled',
      },
      _hover: {
        bg: 'lc.light.bg.blue.hover',
        color: 'lc.light.icon.blue',
      },
      _active: {
        background: 'lc.light.bg.blue.active',
        border: '2px solid',
        borderColor: 'lc.light.border.blue',
      },
    }),
    lcSquareGreen: defineStyle({
      bg: 'lc.light.bg.green.default',
      borderRadius: '8px',
      w: '40px',
      h: '40px',
      color: 'lc.light.icon.green',
      _disabled: {
        cursor: 'not-allowed',
        opacity: 1,
        bg: 'none',
        color: 'lc.light.icon.disabled',
      },
      _hover: {
        bg: 'lc.light.bg.green.hover',
        color: 'lc.light.icon.green',
      },
      _active: {
        background: 'lc.light.bg.green.active',
        border: '2px solid',
        borderColor: 'lc.light.border.green',
      },
    }),
    lcSquareGray: defineStyle({
      bg: 'lc.light.bg.gray.default',
      borderRadius: '8px',
      w: '40px',
      h: '40px',
      color: 'lc.light.icon.gray',
      _disabled: {
        cursor: 'not-allowed',
        opacity: 1,
        bg: 'none',
        color: 'lc.light.icon.disabled',
      },
      _hover: {
        bg: 'lc.light.bg.gray.hover',
        color: 'lc.light.icon.gray',
      },
      _active: {
        background: 'lc.light.bg.gray.active',
        border: '2px solid',
        borderColor: 'lc.light.border.green',
      },
    }),
  },
});

export default Button;
