import { moveCenter } from '@/common/dom';
import { useResize } from '@/hooks/useWindows';
import {
  Badge,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { PaperSizes, getDPR, getPaperSize, paperSizes } from '../../common/client';
import { isError } from '../../common/is';
import { useTheToast } from '../../hooks/useUi';
import useArtboardStore from '../../store/artboard';
import { debounce } from 'lodash';
import api from './apiServices';

const dpr = getDPR();
enum SizeTransformType {
  ARTBOARD_TO_EXPORT,
  EXPORT_TO_ARTBOARD,
}
const sizeTransform = (v: number | string = 0, type?: SizeTransformType) => {
  if (type === SizeTransformType.EXPORT_TO_ARTBOARD) {
    return +v * dpr;
  }
  return parseInt(`${+v / dpr}`, 10);
};

export default function ArtboardSize() {
  const { width, height, changeRect } = useArtboardStore();
  const toast = useTheToast();

  useResize(moveCenter);
  const onClickSizeScheme = (size: keyof PaperSizes) => {
    const rect: any = getPaperSize(size);
    if (isError(rect)) {
      toast(rect);
      return;
    }
    if (rect?.width && rect?.height) {
      changeRect(rect);
    }
  };
  const onChangeColor = useCallback(
    debounce((color: string) => {
      api.setBackgroundColor({ color });
    }, 300),
    [],
  );

  return (
    <div className="control">
      <Text fontSize="l" as="b">
        Artboard Rect
      </Text>
      <InputGroup>
        <InputLeftAddon children="width" />
        <NumberInput value={width} onChange={(v) => changeRect({ width: +v, height })}>
          <NumberInputField borderLeftRadius={0} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children="height" />
        <NumberInput value={height} onChange={(v) => changeRect({ width, height: +v })}>
          <NumberInputField borderLeftRadius={0} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>

      <Text fontSize="l" as="b">
        Export Size
      </Text>

      <InputGroup>
        <InputLeftAddon children="width" />
        <NumberInput
          value={sizeTransform(width, SizeTransformType.ARTBOARD_TO_EXPORT)}
          onChange={(v) => {
            changeRect({
              width: sizeTransform(v, SizeTransformType.EXPORT_TO_ARTBOARD),
              height,
            });
          }}
        >
          <NumberInputField borderLeftRadius={0} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>

      <InputGroup>
        <InputLeftAddon children="height" />
        <NumberInput
          value={sizeTransform(height, SizeTransformType.ARTBOARD_TO_EXPORT)}
          onChange={(v) => {
            changeRect({
              width,
              height: sizeTransform(v, SizeTransformType.EXPORT_TO_ARTBOARD),
            });
          }}
        >
          <NumberInputField borderLeftRadius={0} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children="DPR" />
        <Input value={dpr} type="number" placeholder="dpr" disabled />
      </InputGroup>

      <Flex gap={1}>
        {Object.keys(paperSizes).map((size) => (
          <Badge
            cursor="pointer"
            key={size}
            colorScheme="purple"
            onClick={onClickSizeScheme.bind(null, size as keyof PaperSizes)}
          >
            {size}
          </Badge>
        ))}
      </Flex>

      <Text fontSize="l" as="b">
        Background Color
      </Text>
      <Flex gap={2}>
        <input
          defaultValue="#FFFFFF"
          type="color"
          style={{ width: 24 }}
          onChange={(e: any) => onChangeColor(e.target.value)}
        />
        <div
          style={{ width: 24, backgroundColor: '#FFFFFF' }}
          className="artboardPresetColors"
          onClick={() => onChangeColor('#FFFFFF')}
        ></div>
        <div
          style={{ width: 24, backgroundColor: '#CCCCCC' }}
          className="artboardPresetColors"
          onClick={() => onChangeColor('#CCCCCC')}
        ></div>
        <div
          style={{ width: 24, backgroundColor: '#f7dc6f' }}
          className="artboardPresetColors"
          onClick={() => onChangeColor('#f7dc6f')}
        ></div>
        <div
          style={{ width: 24, backgroundColor: '#aed6f1' }}
          className="artboardPresetColors"
          onClick={() => onChangeColor('#aed6f1')}
        ></div>
        <div
          style={{ width: 24, backgroundColor: '#B366BC' }}
          className="artboardPresetColors"
          onClick={() => onChangeColor('#B366BC')}
        ></div>
        <div
          style={{ width: 24, backgroundColor: '#333333' }}
          className="artboardPresetColors"
          onClick={() => onChangeColor('#333333')}
        ></div>
      </Flex>
    </div>
  );
}
