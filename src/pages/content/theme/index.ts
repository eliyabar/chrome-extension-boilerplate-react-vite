import { extendTheme } from '@chakra-ui/react';
import colors from './colors';
import Button from './components/button';

const mainTheme = extendTheme({
  colors,
  components: {
    Button,
  },
});

export default mainTheme;
