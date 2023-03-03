import React from 'react';
import { createIcon } from '@chakra-ui/react';

export const LineIcon = createIcon({
  defaultProps: {
    w: '16px',
    h: '16px',
    fill: 'none',
  },
  viewBox: '0 0 19 19',
  path: (
    <path
      d="M17.5 1L1 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});

export const ArrowIcon = createIcon({
  defaultProps: {
    w: '24px',
    h: '24px',
    fill: 'none',
  },
  viewBox: '0 0 24 24',
  path: (
    <path
      d="M12 3.75H20.25M20.25 3.75V12M20.25 3.75L3.75 20.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});
export const RulerIcon = createIcon({
  defaultProps: {
    w: '24px',
    h: '24px',
    fill: 'none',
  },
  viewBox: '0 0 24 24',
  path: [
    <path
      key="1"
      d="M3.75 4.14844V7.16016M3.75 10.125V7.16016M3.75 7.16016H20.25M20.25 7.16016V4.125M20.25 7.16016V10.125"
      stroke="currentColor"
      strokeWidth="1.5"
    />,
    <path
      key="2"
      d="M6.75 19.125L3.75 19.125L3.75 12.375L20.25 12.375L20.25 19.125L17.25 19.125M6.75 19.125L6.75 15.75M6.75 19.125L9.375 19.125M9.375 19.125L9.375 16.875M9.375 19.125L12 19.125M12 19.125L12 15.75M12 19.125L14.625 19.125M14.625 19.125L14.625 16.875M14.625 19.125L17.25 19.125M17.25 19.125L17.25 15.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ],
});

export const CheckIcon = createIcon({
  displayName: 'CheckIcon',
  viewBox: '0 0 24 24',
  defaultProps: {
    strokeWidth: '1.5px',
    stroke: 'currentColor',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  path: <path d="M5 12l5 5L20 7" />,
});
export const XIconSmall = createIcon({
  defaultProps: {
    w: '16px',
    h: '16px',
  },
  viewBox: '0 0 16 16',
  path: (
    <path
      d="M4 4L8 8M12 12L8 8M8 8L12 4M8 8L4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
});

export const ColorPickerIcon = createIcon({
  defaultProps: {
    fill: 'currentColor',
    w: '40px',
    h: '40px',
  },
  viewBox: '0 0 40 40',
  path: [
    <rect
      key="1"
      x="7"
      y="11"
      width="17"
      height="17"
      rx="3"
      fill="currentColor"
    />,
    <rect
      key="2"
      x="7"
      y="11"
      width="18"
      height="18"
      rx="3"
      stroke="#F2F0F4"
    />,
    <path
      key="3"
      d="M34.75 17.5L32 14.5L29.25 17.5"
      stroke="black"
      fill={'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="4"
      d="M29.25 22.5L32 25.5L34.75 22.5"
      stroke="black"
      fill={'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ],
});
export const ColorIcon = createIcon({
  defaultProps: {
    fill: 'currentColor',
    w: '32px',
    h: '32px',
  },
  viewBox: '0 0 40 40',
  path: [
    <rect
      key="1"
      x="11"
      y="11"
      width="17"
      height="17"
      rx="3"
      fill="currentColor"
    />,
    <rect
      key="2"
      x="11"
      y="11"
      width="18"
      height="18"
      rx="3"
      stroke="#F2F0F4"
    />,
  ],
});

export const pencilCursor = createIcon({
  defaultProps: {
    fill: 'currentColor',
    w: '24px',
    h: '24px',
  },
  path: [
    <path
      key="1"
      d="M4 20h4L18.5 9.5a2.829 2.829 0 00-4-4L4 16v4z"
      fill="#fff"
      stroke="#85008F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="2"
      d="M13.5 6.5l4 4"
      stroke="#85008F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ],
});
