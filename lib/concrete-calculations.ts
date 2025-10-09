export type Unit = 'feet' | 'inches' | 'meters';
export type VolumeUnit = 'cubic-yards' | 'cubic-meters';

export function convertToFeet(value: number, unit: Unit): number {
  switch (unit) {
    case 'feet':
      return value;
    case 'inches':
      return value / 12;
    case 'meters':
      return value * 3.28084;
  }
}

export function cubicFeetToCubicYards(cubicFeet: number): number {
  return cubicFeet / 27;
}

export function cubicFeetToCubicMeters(cubicFeet: number): number {
  return cubicFeet * 0.0283168;
}

export function calculateSlabVolume(
  length: number,
  width: number,
  thickness: number,
  lengthUnit: Unit,
  widthUnit: Unit,
  thicknessUnit: Unit
): { cubicYards: number; cubicMeters: number; cubicFeet: number } {
  const lengthFeet = convertToFeet(length, lengthUnit);
  const widthFeet = convertToFeet(width, widthUnit);
  const thicknessFeet = convertToFeet(thickness, thicknessUnit);

  const cubicFeet = lengthFeet * widthFeet * thicknessFeet;
  const cubicYards = cubicFeetToCubicYards(cubicFeet);
  const cubicMeters = cubicFeetToCubicMeters(cubicFeet);

  return { cubicYards, cubicMeters, cubicFeet };
}

export function calculateBeamVolume(
  length: number,
  width: number,
  depth: number,
  lengthUnit: Unit,
  widthUnit: Unit,
  depthUnit: Unit
): { cubicYards: number; cubicMeters: number; cubicFeet: number } {
  const lengthFeet = convertToFeet(length, lengthUnit);
  const widthFeet = convertToFeet(width, widthUnit);
  const depthFeet = convertToFeet(depth, depthUnit);

  const cubicFeet = lengthFeet * widthFeet * depthFeet;
  const cubicYards = cubicFeetToCubicYards(cubicFeet);
  const cubicMeters = cubicFeetToCubicMeters(cubicFeet);

  return { cubicYards, cubicMeters, cubicFeet };
}

export function calculateColumnVolume(
  height: number,
  width: number,
  depth: number,
  heightUnit: Unit,
  widthUnit: Unit,
  depthUnit: Unit,
  isCircular: boolean = false,
  diameter?: number,
  diameterUnit?: Unit
): { cubicYards: number; cubicMeters: number; cubicFeet: number } {
  let cubicFeet: number;

  if (isCircular && diameter && diameterUnit) {
    const heightFeet = convertToFeet(height, heightUnit);
    const diameterFeet = convertToFeet(diameter, diameterUnit);
    const radius = diameterFeet / 2;
    cubicFeet = Math.PI * radius * radius * heightFeet;
  } else {
    const heightFeet = convertToFeet(height, heightUnit);
    const widthFeet = convertToFeet(width, widthUnit);
    const depthFeet = convertToFeet(depth, depthUnit);
    cubicFeet = heightFeet * widthFeet * depthFeet;
  }

  const cubicYards = cubicFeetToCubicYards(cubicFeet);
  const cubicMeters = cubicFeetToCubicMeters(cubicFeet);

  return { cubicYards, cubicMeters, cubicFeet };
}

export function calculateFootingVolume(
  length: number,
  width: number,
  depth: number,
  lengthUnit: Unit,
  widthUnit: Unit,
  depthUnit: Unit
): { cubicYards: number; cubicMeters: number; cubicFeet: number } {
  const lengthFeet = convertToFeet(length, lengthUnit);
  const widthFeet = convertToFeet(width, widthUnit);
  const depthFeet = convertToFeet(depth, depthUnit);

  const cubicFeet = lengthFeet * widthFeet * depthFeet;
  const cubicYards = cubicFeetToCubicYards(cubicFeet);
  const cubicMeters = cubicFeetToCubicMeters(cubicFeet);

  return { cubicYards, cubicMeters, cubicFeet };
}

export function calculateWallVolume(
  length: number,
  height: number,
  thickness: number,
  lengthUnit: Unit,
  heightUnit: Unit,
  thicknessUnit: Unit
): { cubicYards: number; cubicMeters: number; cubicFeet: number } {
  const lengthFeet = convertToFeet(length, lengthUnit);
  const heightFeet = convertToFeet(height, heightUnit);
  const thicknessFeet = convertToFeet(thickness, thicknessUnit);

  const cubicFeet = lengthFeet * heightFeet * thicknessFeet;
  const cubicYards = cubicFeetToCubicYards(cubicFeet);
  const cubicMeters = cubicFeetToCubicMeters(cubicFeet);

  return { cubicYards, cubicMeters, cubicFeet };
}

export function calculateMaterialBreakdown(
  cubicYards: number,
  wastePercentage: number = 10
): {
  cement: number;
  sand: number;
  aggregate: number;
  totalWithWaste: number;
} {
  const totalWithWaste = cubicYards * (1 + wastePercentage / 100);

  const cement = totalWithWaste * 0.22;
  const sand = totalWithWaste * 0.33;
  const aggregate = totalWithWaste * 0.45;

  return {
    cement,
    sand,
    aggregate,
    totalWithWaste,
  };
}
