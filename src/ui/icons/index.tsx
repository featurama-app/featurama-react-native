import { View } from 'react-native';

interface IconProps {
  size: number;
  color: string;
}

export function CloseIcon({ size, color }: IconProps): JSX.Element {
  const thickness = Math.max(2, size * 0.12);
  const diagonal = size * 0.6;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: diagonal,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: diagonal,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

export function PlusIcon({ size, color }: IconProps): JSX.Element {
  const thickness = Math.max(2, size * 0.12);
  const barLength = size * 0.6;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: barLength,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: thickness,
          height: barLength,
          backgroundColor: color,
          borderRadius: thickness / 2,
        }}
      />
    </View>
  );
}

export function ChevronUpIcon({ size, color }: IconProps): JSX.Element {
  const triangleSize = size * 0.55;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: triangleSize / 2,
          borderRightWidth: triangleSize / 2,
          borderBottomWidth: triangleSize * 0.75,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    </View>
  );
}

export function ChevronLeftIcon({ size, color }: IconProps): JSX.Element {
  const triangleSize = size * 0.55;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: triangleSize / 2,
          borderBottomWidth: triangleSize / 2,
          borderRightWidth: triangleSize * 0.75,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: color,
        }}
      />
    </View>
  );
}

export function ChatBubbleIcon({ size, color }: IconProps): JSX.Element {
  const thickness = Math.max(1.5, size * 0.1);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Bubble body */}
      <View
        style={{
          width: size * 0.7,
          height: size * 0.5,
          borderWidth: thickness,
          borderColor: color,
          borderRadius: size * 0.12,
          marginTop: -size * 0.05,
        }}
      />
      {/* Tail */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.1,
          borderRightWidth: size * 0.1,
          borderTopWidth: size * 0.12,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          marginLeft: -size * 0.2,
          marginTop: -thickness / 2,
        }}
      />
    </View>
  );
}

export function SendIcon({ size, color }: IconProps): JSX.Element {
  const thickness = Math.max(2, size * 0.1);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Arrow shaft */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.55,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          transform: [{ rotate: '-45deg' }, { translateX: -size * 0.05 }],
        }}
      />
      {/* Arrow head - top */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.3,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          top: size * 0.2,
          right: size * 0.18,
          transform: [{ rotate: '0deg' }],
        }}
      />
      {/* Arrow head - right */}
      <View
        style={{
          position: 'absolute',
          width: thickness,
          height: size * 0.3,
          backgroundColor: color,
          borderRadius: thickness / 2,
          top: size * 0.2,
          right: size * 0.18,
          transform: [{ rotate: '0deg' }],
        }}
      />
    </View>
  );
}
