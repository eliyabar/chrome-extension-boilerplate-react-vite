/* eslint-disable react/display-name */
import React, { RefAttributes } from 'react';
import {
  Box,
  ButtonProps,
  Center,
  Divider,
  Icon,
  IconButton,
  IconProps,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ArrowArcLeft,
  ArrowArcRight,
  Circle,
  NavigationArrow,
  PencilSimpleLine,
  Square,
  TextT,
} from 'phosphor-react';
import { ShapesArgs } from './fabric/ShapeFactory';
import {
  ColorPickerIcon,
  ColorIcon,
  CheckIcon,
  XIconSmall,
  ArrowIcon,
  LineIcon,
  RulerIcon,
} from './Icons';

interface ColorButtonProps {
  color: string;
  onClick: () => void;
  activeColor: typeof COLOR_OPTIONS[number];
}
export const capitaliseFirstLetter = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const ColorButton: React.FC<ColorButtonProps & ButtonProps> = ({
  color,
  onClick,
  activeColor,
  ...rest
}) => {
  const isActive = activeColor === color;
  return (
    <IconButton
      icon={
        isActive ? (
          <ColorPickerIcon color={color} />
        ) : (
          <ColorIcon color={color} />
        )
      }
      aria-label={'color-selection'}
      borderRadius="4px"
      minWidth="0"
      variant="lcSquareBlue"
      onClick={onClick}
      {...rest}
    />
  );
};
export type DrawingBoardToolsProps = {
  onCancelDrawing: () => void;
  onDrawingComplete: () => void;
  chooseColorCallback: (color: typeof COLOR_OPTIONS[number]) => void;
  toggleDrawingMode: () => void;
  drawingMode: boolean;
  activeColor: typeof COLOR_OPTIONS[number];
  shapes?: Array<ShapesArgs['name']>;
  onAddShape: (shape: ShapesArgs['name']) => void;
  activeTool?: ShapesArgs['name'];
  onCursorIconClick: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};
export const DrawingBoardTools: React.FC<DrawingBoardToolsProps> = ({
  onCancelDrawing,
  chooseColorCallback,
  onDrawingComplete,
  activeColor,
  toggleDrawingMode,
  drawingMode,
  shapes = ['rectangle', 'ellipse', 'line', 'arrow', 'text', 'measure'],
  onAddShape,
  activeTool,
  onCursorIconClick,
  undo,
  redo,
  canUndo,
  canRedo,
}) => (
  <Box
    borderRadius={'8px'}
    px={'8px'}
    left={'50%'}
    transform={'translateX(-50%)'}
    alignItems={'center'}
    pointerEvents={'all'}
    display={'flex'}
    h={'48px'}
    background={'white'}
    boxShadow={'4px 6px 16px rgba(0, 0, 0, 0.12)'}
    zIndex="999"
    gap={'4px'}
    position={'absolute'}
    bottom={'-72px'}
    top={''}
  >
    <ColorButtons onClick={chooseColorCallback} activeColor={activeColor} />
    <Divider h={'24px'} orientation="vertical" borderColor="#D8D8D8" />
    <Tooltip label={'Select'}>
      <IconButton
        aria-label="select"
        bg={!(drawingMode || activeTool) ? '#ECEDFD' : {}}
        icon={
          <Icon
            as={NavigationArrow}
            w="24px"
            h="24px"
            color={!(drawingMode || activeTool) ? {} : '#1B1B1F'}
          />
        }
        onClick={onCursorIconClick}
        size="xs"
        variant="lcSquareBlue"
      />
    </Tooltip>
    <Divider h={'24px'} orientation="vertical" borderColor="#D8D8D8" />
    <Tooltip label={'Free Drawing'}>
      <IconButton
        aria-label="draw"
        bg={drawingMode ? '#ECEDFD' : {}}
        icon={
          <Icon
            as={PencilSimpleLine}
            w="24px"
            h="24px"
            color={drawingMode ? {} : '#1B1B1F'}
          />
        }
        onClick={toggleDrawingMode}
        size="xs"
        variant="lcSquareBlue"
      />
    </Tooltip>
    {shapes.map((shapeName) => (
      <Tooltip
        key={`${shapeName}_tt`}
        label={`${capitaliseFirstLetter(shapeName)}`}
      >
        <IconButton
          key={shapeName}
          bg={activeTool === shapeName ? '#ECEDFD' : {}}
          aria-label={`${shapeName}-tool`}
          icon={
            <ToolIcon
              name={shapeName}
              color={activeTool === shapeName ? {} : '#1B1B1F'}
            />
          }
          onClick={() => onAddShape(shapeName)}
          size="xs"
          variant="lcSquareBlue"
        />
      </Tooltip>
    ))}
    <Divider h={'24px'} orientation="vertical" borderColor="#D8D8D8" />
    <Tooltip label={'Undo'}>
      <IconButton
        aria-label={`undo`}
        disabled={!canUndo}
        icon={
          <Icon
            as={ArrowArcLeft}
            name={'undo'}
            w="24px"
            h="24px"
            color={!canUndo ? '#CACACA' : '#1B1B1F'}
          />
        }
        onClick={undo}
        size="xs"
        variant="lcSquareBlue"
      />
    </Tooltip>
    <Tooltip label={'Redo'}>
      <IconButton
        aria-label={`redo`}
        disabled={!canRedo}
        icon={
          <Icon
            as={ArrowArcRight}
            name={'undo'}
            w="24px"
            h="24px"
            color={!canRedo ? '#CACACA' : '#1B1B1F'}
          />
        }
        onClick={redo}
        size="xs"
        variant="lcSquareBlue"
      />
    </Tooltip>
    <Center position={'absolute'} ml={`100%`}>
      <Tooltip label={'Add Snip'}>
        <IconButton
          w={'32px'}
          h={'32px'}
          aria-label="add snip"
          icon={<Icon as={CheckIcon} w="24px" h="24px" />}
          onClick={onDrawingComplete}
          size="xs"
          variant="lcSquareGreen"
          mr={'8px'}
        />
      </Tooltip>
      <Tooltip label={'Cancel Snip'}>
        <IconButton
          aria-label="cancel-snip"
          w={'32px'}
          h={'32px'}
          icon={<Icon as={XIconSmall} w="24px" h="24px" />}
          onClick={onCancelDrawing}
          title="Cancel snipping"
          size="xs"
          variant="lcSquareGray"
        />
      </Tooltip>
    </Center>
  </Box>
);
const shapeIconMap: Record<
  ShapesArgs['name'],
  React.ElementType<RefAttributes<SVGSVGElement>>
> = {
  arrow: ArrowIcon,
  ellipse: Circle,
  line: LineIcon,
  text: TextT,
  rectangle: Square,
  measure: RulerIcon,
};
const ToolIcon: React.FC<{ name: ShapesArgs['name'] } & IconProps> = ({
  name,
  ...props
}) => {
  return <Icon as={shapeIconMap[name]} w="24px" h="24px" {...props} />;
};
export const COLOR_OPTIONS = [
  '#FFFFFF',
  '#171B2C',
  '#97F899',
  '#DE3730',
  '#FF5449',
  '#416AFA',
  '#FFDB50',
  '#8C49FF',
  '#C8C6CA',
] as const;
export const DEFAULT_COLOR_ID = 3;

type ColorButtonsProps = Pick<ColorButtonProps, 'activeColor'> & {
  onClick: (color: typeof COLOR_OPTIONS[number]) => void;
  colors?: typeof COLOR_OPTIONS;
};
const ColorButtons: React.FC<ColorButtonsProps> = React.memo(
  // eslint-disable-next-line react/prop-types
  ({ colors = COLOR_OPTIONS, activeColor, onClick }) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    return (
      <>
        {isOpen && (
          <Center
            w={'136px'}
            h={'72px'}
            boxShadow={`0px 0px 8px rgba(0, 0, 0, 0.12)`}
            borderRadius={'8px'}
            position={'absolute'}
            transform={'translate(-52px,-62px)'}
            flexWrap={'wrap'}
            bg={'inherit'}
            p={'0px'}
            gap={'1px'}
          >
            {colors
              .filter((x) => x != activeColor)
              .map((color) => (
                <ColorButton
                  maxW={'32px'}
                  maxH={'32px'}
                  key={color}
                  color={color}
                  activeColor={activeColor}
                  onClick={() => {
                    onClick(color);
                    onClose();
                  }}
                />
              ))}
          </Center>
        )}
        <ColorButton
          color={activeColor}
          activeColor={activeColor}
          onClick={onToggle}
        />
      </>
    );
  }
);
