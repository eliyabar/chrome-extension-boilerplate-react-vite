import { Box } from '@chakra-ui/react';
import { BoundingRect } from './types';

export const SnippingOverlay = (props: {
  rect?: BoundingRect;
  isActive: boolean;
  onClose: () => void;
}) => {
  return props.isActive ? (
    <Box
      id={'xxxx'}
      position="absolute"
      width="100%"
      height="100%"
      background={'rgba(17, 14, 30, 0.7)'}
      top="0px"
      left="0px"
      onClick={props.onClose}
      zIndex="998"
    />
  ) : null;
};

//TODO: fix that
function generateDataUrlBackground(props: BoundingRect) {
  //return `url( "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 200'%3E%3Cpath d='M10 10h123v123H10z'/%3E%3C/svg%3E" );`;
  //return `url( "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' %3E%3Cmask id='msk'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='white' /%3E%3Crect x='${props.left}' y='${props.top}' width='${props.width}' height='${props.height}' fill='black' /%3E%3C/mask%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='blue' mask='url(%23msk)' /%3E%3C/svg%3E");`;
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100%25 100%25' height='100%25' width='100%25' preserveAspectRatio='none'%3E%3Cmask id='msk'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='white'/%3E%3Crect x='${props.left}' y='${props.top}' height='${props.height}' width='${props.width}' fill='black'/%3E%3C/mask%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='rgba(17, 14, 30, 0.7)' mask='url(%23msk)' /%3E%3C/svg%3E");`;
}
