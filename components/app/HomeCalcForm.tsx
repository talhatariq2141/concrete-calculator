'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  calculateSlabVolume,
  calculateBeamVolume,
  calculateColumnVolume,
  calculateFootingVolume,
  calculateWallVolume,
  calculateMaterialBreakdown,
  type Unit,
} from '@/lib/concrete-calculations';
import { Calculator } from 'lucide-react';

export function CalculatorForm() {
  const [slabLength, setSlabLength] = useState('');
  const [slabWidth, setSlabWidth] = useState('');
  const [slabThickness, setSlabThickness] = useState('');
  const [slabLengthUnit, setSlabLengthUnit] = useState<Unit>('feet');
  const [slabWidthUnit, setSlabWidthUnit] = useState<Unit>('feet');
  const [slabThicknessUnit, setSlabThicknessUnit] = useState<Unit>('inches');

  const [beamLength, setBeamLength] = useState('');
  const [beamWidth, setBeamWidth] = useState('');
  const [beamDepth, setBeamDepth] = useState('');
  const [beamLengthUnit, setBeamLengthUnit] = useState<Unit>('feet');
  const [beamWidthUnit, setBeamWidthUnit] = useState<Unit>('inches');
  const [beamDepthUnit, setBeamDepthUnit] = useState<Unit>('inches');

  const [columnHeight, setColumnHeight] = useState('');
  const [columnWidth, setColumnWidth] = useState('');
  const [columnDepth, setColumnDepth] = useState('');
  const [columnIsCircular, setColumnIsCircular] = useState(false);
  const [columnDiameter, setColumnDiameter] = useState('');
  const [columnHeightUnit, setColumnHeightUnit] = useState<Unit>('feet');
  const [columnWidthUnit, setColumnWidthUnit] = useState<Unit>('inches');
  const [columnDepthUnit, setColumnDepthUnit] = useState<Unit>('inches');
  const [columnDiameterUnit, setColumnDiameterUnit] = useState<Unit>('inches');

  const [footingLength, setFootingLength] = useState('');
  const [footingWidth, setFootingWidth] = useState('');
  const [footingDepth, setFootingDepth] = useState('');
  const [footingLengthUnit, setFootingLengthUnit] = useState<Unit>('feet');
  const [footingWidthUnit, setFootingWidthUnit] = useState<Unit>('feet');
  const [footingDepthUnit, setFootingDepthUnit] = useState<Unit>('inches');

  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [wallThickness, setWallThickness] = useState('');
  const [wallLengthUnit, setWallLengthUnit] = useState<Unit>('feet');
  const [wallHeightUnit, setWallHeightUnit] = useState<Unit>('feet');
  const [wallThicknessUnit, setWallThicknessUnit] = useState<Unit>('inches');

  const [wastePercentage, setWastePercentage] = useState('10');

  const [slabResult, setSlabResult] = useState<{ cubicYards: number; cubicMeters: number } | null>(null);
  const [beamResult, setBeamResult] = useState<{ cubicYards: number; cubicMeters: number } | null>(null);
  const [columnResult, setColumnResult] = useState<{ cubicYards: number; cubicMeters: number } | null>(null);
  const [footingResult, setFootingResult] = useState<{ cubicYards: number; cubicMeters: number } | null>(null);
  const [wallResult, setWallResult] = useState<{ cubicYards: number; cubicMeters: number } | null>(null);

  const calculateSlab = () => {
    if (slabLength && slabWidth && slabThickness) {
      const result = calculateSlabVolume(
        parseFloat(slabLength),
        parseFloat(slabWidth),
        parseFloat(slabThickness),
        slabLengthUnit,
        slabWidthUnit,
        slabThicknessUnit
      );
      setSlabResult(result);
    }
  };

  const calculateBeam = () => {
    if (beamLength && beamWidth && beamDepth) {
      const result = calculateBeamVolume(
        parseFloat(beamLength),
        parseFloat(beamWidth),
        parseFloat(beamDepth),
        beamLengthUnit,
        beamWidthUnit,
        beamDepthUnit
      );
      setBeamResult(result);
    }
  };

  const calculateColumn = () => {
    if (columnIsCircular && columnHeight && columnDiameter) {
      const result = calculateColumnVolume(
        parseFloat(columnHeight),
        0,
        0,
        columnHeightUnit,
        'feet',
        'feet',
        true,
        parseFloat(columnDiameter),
        columnDiameterUnit
      );
      setColumnResult(result);
    } else if (!columnIsCircular && columnHeight && columnWidth && columnDepth) {
      const result = calculateColumnVolume(
        parseFloat(columnHeight),
        parseFloat(columnWidth),
        parseFloat(columnDepth),
        columnHeightUnit,
        columnWidthUnit,
        columnDepthUnit,
        false
      );
      setColumnResult(result);
    }
  };

  const calculateFooting = () => {
    if (footingLength && footingWidth && footingDepth) {
      const result = calculateFootingVolume(
        parseFloat(footingLength),
        parseFloat(footingWidth),
        parseFloat(footingDepth),
        footingLengthUnit,
        footingWidthUnit,
        footingDepthUnit
      );
      setFootingResult(result);
    }
  };

  const calculateWall = () => {
    if (wallLength && wallHeight && wallThickness) {
      const result = calculateWallVolume(
        parseFloat(wallLength),
        parseFloat(wallHeight),
        parseFloat(wallThickness),
        wallLengthUnit,
        wallHeightUnit,
        wallThicknessUnit
      );
      setWallResult(result);
    }
  };

  const renderResult = (result: { cubicYards: number; cubicMeters: number } | null) => {
    if (!result) return null;

    const materials = calculateMaterialBreakdown(result.cubicYards, parseFloat(wastePercentage) || 10);

    return (
      <div className="mt-6 p-4 bg-teal-400/10 border border-teal-400/30 rounded-lg">
        <h3 className="text-lg font-semibold text-teal-400 mb-3">Results</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Cubic Yards</p>
              <p className="text-2xl font-bold text-white">{result.cubicYards.toFixed(2)} yd³</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Cubic Meters</p>
              <p className="text-2xl font-bold text-white">{result.cubicMeters.toFixed(2)} m³</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm font-semibold text-slate-300 mb-2">Material Breakdown (with {wastePercentage}% waste)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Volume:</span>
                <span className="text-white font-medium">{materials.totalWithWaste.toFixed(2)} yd³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cement (22%):</span>
                <span className="text-white font-medium">{materials.cement.toFixed(2)} yd³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sand (33%):</span>
                <span className="text-white font-medium">{materials.sand.toFixed(2)} yd³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aggregate (45%):</span>
                <span className="text-white font-medium">{materials.aggregate.toFixed(2)} yd³</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="slab" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="slab" id="slab">Slab</TabsTrigger>
          <TabsTrigger value="beam" id="beam">Beam</TabsTrigger>
          <TabsTrigger value="column" id="column">Column</TabsTrigger>
          <TabsTrigger value="footing" id="footing">Footing</TabsTrigger>
          <TabsTrigger value="wall" id="wall">Wall</TabsTrigger>
        </TabsList>

        <TabsContent value="slab">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Concrete Slab Calculator</CardTitle>
              <CardDescription className="text-slate-400">Calculate concrete volume for slabs and floors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slab-length" className="text-slate-300">Length</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slab-length"
                      type="number"
                      placeholder="0"
                      value={slabLength}
                      onChange={(e) => setSlabLength(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={slabLengthUnit} onValueChange={(v) => setSlabLengthUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slab-width" className="text-slate-300">Width</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slab-width"
                      type="number"
                      placeholder="0"
                      value={slabWidth}
                      onChange={(e) => setSlabWidth(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={slabWidthUnit} onValueChange={(v) => setSlabWidthUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slab-thickness" className="text-slate-300">Thickness</Label>
                <div className="flex gap-2">
                  <Input
                    id="slab-thickness"
                    type="number"
                    placeholder="0"
                    value={slabThickness}
                    onChange={(e) => setSlabThickness(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                  />
                  <Select value={slabThicknessUnit} onValueChange={(v) => setSlabThicknessUnit(v as Unit)}>
                    <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="feet">ft</SelectItem>
                      <SelectItem value="inches">in</SelectItem>
                      <SelectItem value="meters">m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="waste-percentage" className="text-slate-300">Waste Percentage</Label>
                <Input
                  id="waste-percentage"
                  type="number"
                  placeholder="10"
                  value={wastePercentage}
                  onChange={(e) => setWastePercentage(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                />
              </div>
              <Button onClick={calculateSlab} className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Volume
              </Button>
              {renderResult(slabResult)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beam">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Concrete Beam Calculator</CardTitle>
              <CardDescription className="text-slate-400">Calculate concrete volume for beams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beam-length" className="text-slate-300">Length</Label>
                  <div className="flex gap-2">
                    <Input
                      id="beam-length"
                      type="number"
                      placeholder="0"
                      value={beamLength}
                      onChange={(e) => setBeamLength(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={beamLengthUnit} onValueChange={(v) => setBeamLengthUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beam-width" className="text-slate-300">Width</Label>
                  <div className="flex gap-2">
                    <Input
                      id="beam-width"
                      type="number"
                      placeholder="0"
                      value={beamWidth}
                      onChange={(e) => setBeamWidth(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={beamWidthUnit} onValueChange={(v) => setBeamWidthUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="beam-depth" className="text-slate-300">Depth</Label>
                <div className="flex gap-2">
                  <Input
                    id="beam-depth"
                    type="number"
                    placeholder="0"
                    value={beamDepth}
                    onChange={(e) => setBeamDepth(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                  />
                  <Select value={beamDepthUnit} onValueChange={(v) => setBeamDepthUnit(v as Unit)}>
                    <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="feet">ft</SelectItem>
                      <SelectItem value="inches">in</SelectItem>
                      <SelectItem value="meters">m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={calculateBeam} className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Volume
              </Button>
              {renderResult(beamResult)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="column">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Concrete Column Calculator</CardTitle>
              <CardDescription className="text-slate-400">Calculate concrete volume for columns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="circular-column"
                  checked={columnIsCircular}
                  onCheckedChange={setColumnIsCircular}
                />
                <Label htmlFor="circular-column" className="text-slate-300">Circular Column</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="column-height" className="text-slate-300">Height</Label>
                <div className="flex gap-2">
                  <Input
                    id="column-height"
                    type="number"
                    placeholder="0"
                    value={columnHeight}
                    onChange={(e) => setColumnHeight(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                  />
                  <Select value={columnHeightUnit} onValueChange={(v) => setColumnHeightUnit(v as Unit)}>
                    <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="feet">ft</SelectItem>
                      <SelectItem value="inches">in</SelectItem>
                      <SelectItem value="meters">m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {columnIsCircular ? (
                <div className="space-y-2">
                  <Label htmlFor="column-diameter" className="text-slate-300">Diameter</Label>
                  <div className="flex gap-2">
                    <Input
                      id="column-diameter"
                      type="number"
                      placeholder="0"
                      value={columnDiameter}
                      onChange={(e) => setColumnDiameter(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={columnDiameterUnit} onValueChange={(v) => setColumnDiameterUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="column-width" className="text-slate-300">Width</Label>
                    <div className="flex gap-2">
                      <Input
                        id="column-width"
                        type="number"
                        placeholder="0"
                        value={columnWidth}
                        onChange={(e) => setColumnWidth(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                      />
                      <Select value={columnWidthUnit} onValueChange={(v) => setColumnWidthUnit(v as Unit)}>
                        <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="feet">ft</SelectItem>
                          <SelectItem value="inches">in</SelectItem>
                          <SelectItem value="meters">m</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="column-depth" className="text-slate-300">Depth</Label>
                    <div className="flex gap-2">
                      <Input
                        id="column-depth"
                        type="number"
                        placeholder="0"
                        value={columnDepth}
                        onChange={(e) => setColumnDepth(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                      />
                      <Select value={columnDepthUnit} onValueChange={(v) => setColumnDepthUnit(v as Unit)}>
                        <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="feet">ft</SelectItem>
                          <SelectItem value="inches">in</SelectItem>
                          <SelectItem value="meters">m</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <Button onClick={calculateColumn} className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Volume
              </Button>
              {renderResult(columnResult)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footing">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Concrete Footing Calculator</CardTitle>
              <CardDescription className="text-slate-400">Calculate concrete volume for footings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="footing-length" className="text-slate-300">Length</Label>
                  <div className="flex gap-2">
                    <Input
                      id="footing-length"
                      type="number"
                      placeholder="0"
                      value={footingLength}
                      onChange={(e) => setFootingLength(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={footingLengthUnit} onValueChange={(v) => setFootingLengthUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footing-width" className="text-slate-300">Width</Label>
                  <div className="flex gap-2">
                    <Input
                      id="footing-width"
                      type="number"
                      placeholder="0"
                      value={footingWidth}
                      onChange={(e) => setFootingWidth(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={footingWidthUnit} onValueChange={(v) => setFootingWidthUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footing-depth" className="text-slate-300">Depth</Label>
                <div className="flex gap-2">
                  <Input
                    id="footing-depth"
                    type="number"
                    placeholder="0"
                    value={footingDepth}
                    onChange={(e) => setFootingDepth(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                  />
                  <Select value={footingDepthUnit} onValueChange={(v) => setFootingDepthUnit(v as Unit)}>
                    <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="feet">ft</SelectItem>
                      <SelectItem value="inches">in</SelectItem>
                      <SelectItem value="meters">m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={calculateFooting} className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Volume
              </Button>
              {renderResult(footingResult)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wall">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Concrete Wall Calculator</CardTitle>
              <CardDescription className="text-slate-400">Calculate concrete volume for walls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wall-length" className="text-slate-300">Length</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wall-length"
                      type="number"
                      placeholder="0"
                      value={wallLength}
                      onChange={(e) => setWallLength(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={wallLengthUnit} onValueChange={(v) => setWallLengthUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wall-height" className="text-slate-300">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wall-height"
                      type="number"
                      placeholder="0"
                      value={wallHeight}
                      onChange={(e) => setWallHeight(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                    />
                    <Select value={wallHeightUnit} onValueChange={(v) => setWallHeightUnit(v as Unit)}>
                      <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wall-thickness" className="text-slate-300">Thickness</Label>
                <div className="flex gap-2">
                  <Input
                    id="wall-thickness"
                    type="number"
                    placeholder="0"
                    value={wallThickness}
                    onChange={(e) => setWallThickness(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white focus:border-teal-400"
                  />
                  <Select value={wallThicknessUnit} onValueChange={(v) => setWallThicknessUnit(v as Unit)}>
                    <SelectTrigger className="w-24 bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="feet">ft</SelectItem>
                      <SelectItem value="inches">in</SelectItem>
                      <SelectItem value="meters">m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={calculateWall} className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Volume
              </Button>
              {renderResult(wallResult)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
