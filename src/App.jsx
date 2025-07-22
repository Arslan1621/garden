import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Calculator, Sprout, Droplets, Ruler, Package, TreePine } from 'lucide-react'
import './App.css'

function App() {
  // Plant Spacing Calculator State
  const [spacing, setSpacing] = useState({ length: '', width: '', plantSpacing: '' })
  const [spacingResult, setSpacingResult] = useState(null)

  // Seed Quantity Calculator State
  const [seedCalc, setSeedCalc] = useState({ 
    area: '', 
    seedsPerSqFt: '', 
    germinationRate: '85',
    plantType: 'vegetables'
  })
  const [seedResult, setSeedResult] = useState(null)

  // Soil Volume Calculator State
  const [soilCalc, setSoilCalc] = useState({ 
    length: '', 
    width: '', 
    depth: '',
    shape: 'rectangle'
  })
  const [soilResult, setSoilResult] = useState(null)

  // Watering Calculator State
  const [waterCalc, setWaterCalc] = useState({
    area: '',
    plantType: 'vegetables',
    season: 'spring',
    soilType: 'loam'
  })
  const [waterResult, setWaterResult] = useState(null)

  // Garden Area Calculator State
  const [areaCalc, setAreaCalc] = useState({
    shape: 'rectangle',
    length: '',
    width: '',
    radius: ''
  })
  const [areaResult, setAreaResult] = useState(null)

  // Harvest Calculator State
  const [harvestCalc, setHarvestCalc] = useState({
    crop: 'tomatoes',
    plants: '',
    variety: 'standard'
  })
  const [harvestResult, setHarvestResult] = useState(null)

  // Plant Spacing Calculator
  const calculatePlantSpacing = () => {
    const { length, width, plantSpacing } = spacing
    if (!length || !width || !plantSpacing) return

    const areaInSqFt = parseFloat(length) * parseFloat(width)
    const spacingInFt = parseFloat(plantSpacing) / 12 // Convert inches to feet
    const plantsPerSqFt = 1 / (spacingInFt * spacingInFt)
    const totalPlants = Math.floor(areaInSqFt * plantsPerSqFt)
    
    const rowSpacing = spacingInFt
    const plantsPerRow = Math.floor(parseFloat(width) / spacingInFt)
    const numberOfRows = Math.floor(parseFloat(length) / spacingInFt)

    setSpacingResult({
      totalPlants,
      areaInSqFt,
      plantsPerSqFt: plantsPerSqFt.toFixed(2),
      plantsPerRow,
      numberOfRows,
      spacingInFt: spacingInFt.toFixed(2)
    })
  }

  // Seed Quantity Calculator
  const calculateSeedQuantity = () => {
    const { area, seedsPerSqFt, germinationRate } = seedCalc
    if (!area || !seedsPerSqFt) return

    const totalSeeds = parseFloat(area) * parseFloat(seedsPerSqFt)
    const germinationDecimal = parseFloat(germinationRate) / 100
    const seedsNeeded = Math.ceil(totalSeeds / germinationDecimal)
    const extraSeeds = seedsNeeded - totalSeeds

    setSeedResult({
      totalSeeds: Math.ceil(totalSeeds),
      seedsNeeded,
      extraSeeds,
      germinationRate: parseFloat(germinationRate)
    })
  }

  // Soil Volume Calculator
  const calculateSoilVolume = () => {
    const { length, width, depth, shape } = soilCalc
    if (!depth) return

    let volume = 0
    if (shape === 'rectangle' && length && width) {
      volume = parseFloat(length) * parseFloat(width) * (parseFloat(depth) / 12)
    } else if (shape === 'circle' && length) { // length used as diameter
      const radius = parseFloat(length) / 2
      volume = Math.PI * radius * radius * (parseFloat(depth) / 12)
    }

    const cubicYards = volume / 27
    const bags = Math.ceil(cubicYards / 2) // Assuming 2 cubic feet per bag

    setSoilResult({
      cubicFeet: volume.toFixed(2),
      cubicYards: cubicYards.toFixed(2),
      bags
    })
  }

  // Watering Calculator
  const calculateWatering = () => {
    const { area, plantType, season, soilType } = waterCalc
    if (!area) return

    // Base water requirements (inches per week)
    const baseWater = {
      vegetables: { spring: 1.0, summer: 1.5, fall: 0.8, winter: 0.5 },
      flowers: { spring: 0.8, summer: 1.2, fall: 0.6, winter: 0.3 },
      herbs: { spring: 0.6, summer: 1.0, fall: 0.5, winter: 0.2 },
      lawn: { spring: 1.2, summer: 1.8, fall: 1.0, winter: 0.4 }
    }

    // Soil type multipliers
    const soilMultiplier = {
      sand: 1.3,
      loam: 1.0,
      clay: 0.8
    }

    const baseInches = baseWater[plantType][season]
    const adjustedInches = baseInches * soilMultiplier[soilType]
    const areaInSqFt = parseFloat(area)
    const gallonsPerWeek = areaInSqFt * adjustedInches * 0.623 // Convert to gallons
    const minutesPerWeek = gallonsPerWeek / 2 // Assuming 2 GPM sprinkler

    setWaterResult({
      inchesPerWeek: adjustedInches.toFixed(2),
      gallonsPerWeek: gallonsPerWeek.toFixed(1),
      minutesPerWeek: Math.ceil(minutesPerWeek),
      dailyMinutes: Math.ceil(minutesPerWeek / 7)
    })
  }

  // Garden Area Calculator
  const calculateGardenArea = () => {
    const { shape, length, width, radius } = areaCalc
    let area = 0

    if (shape === 'rectangle' && length && width) {
      area = parseFloat(length) * parseFloat(width)
    } else if (shape === 'circle' && radius) {
      area = Math.PI * parseFloat(radius) * parseFloat(radius)
    } else if (shape === 'triangle' && length && width) {
      area = 0.5 * parseFloat(length) * parseFloat(width)
    }

    const acres = area / 43560
    const perimeter = shape === 'rectangle' && length && width 
      ? 2 * (parseFloat(length) + parseFloat(width))
      : shape === 'circle' && radius
      ? 2 * Math.PI * parseFloat(radius)
      : 0

    setAreaResult({
      squareFeet: area.toFixed(2),
      acres: acres.toFixed(4),
      perimeter: perimeter.toFixed(2)
    })
  }

  // Harvest Calculator
  const calculateHarvest = () => {
    const { crop, plants, variety } = harvestCalc
    if (!plants) return

    // Average yields per plant (in pounds)
    const yields = {
      tomatoes: { standard: 10, cherry: 5, beefsteak: 15 },
      peppers: { standard: 2, hot: 1, bell: 3 },
      lettuce: { standard: 1, romaine: 1.5, butterhead: 0.8 },
      beans: { standard: 0.5, pole: 1, bush: 0.3 },
      carrots: { standard: 0.3, baby: 0.2, large: 0.5 },
      cucumbers: { standard: 5, pickling: 3, slicing: 7 }
    }

    const yieldPerPlant = yields[crop]?.[variety] || 1
    const totalYield = parseFloat(plants) * yieldPerPlant
    const weeksOfHarvest = crop === 'lettuce' ? 8 : crop === 'beans' ? 10 : 12
    const weeklyYield = totalYield / weeksOfHarvest

    setHarvestResult({
      totalYield: totalYield.toFixed(1),
      weeklyYield: weeklyYield.toFixed(1),
      weeksOfHarvest,
      yieldPerPlant
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <TreePine className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Garden Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your complete toolkit for garden planning. Calculate plant spacing, seed quantities, 
            soil volumes, watering schedules, and more to grow your perfect garden.
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="spacing" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span className="hidden sm:inline">Spacing</span>
            </TabsTrigger>
            <TabsTrigger value="seeds" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Seeds</span>
            </TabsTrigger>
            <TabsTrigger value="soil" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              <span className="hidden sm:inline">Soil</span>
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              <span className="hidden sm:inline">Water</span>
            </TabsTrigger>
            <TabsTrigger value="area" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Area</span>
            </TabsTrigger>
            <TabsTrigger value="harvest" className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              <span className="hidden sm:inline">Harvest</span>
            </TabsTrigger>
          </TabsList>

          {/* Plant Spacing Calculator */}
          <TabsContent value="spacing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Plant Spacing Calculator
                </CardTitle>
                <CardDescription>
                  Calculate how many plants you can fit in your garden bed with proper spacing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Garden Length (feet)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="10"
                      value={spacing.length}
                      onChange={(e) => setSpacing({...spacing, length: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Garden Width (feet)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="8"
                      value={spacing.width}
                      onChange={(e) => setSpacing({...spacing, width: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plantSpacing">Plant Spacing (inches)</Label>
                    <Input
                      id="plantSpacing"
                      type="number"
                      placeholder="12"
                      value={spacing.plantSpacing}
                      onChange={(e) => setSpacing({...spacing, plantSpacing: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button onClick={calculatePlantSpacing} className="w-full">
                  Calculate Plant Spacing
                </Button>

                {spacingResult && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">Results:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Badge variant="secondary">Total Plants</Badge>
                        <p className="text-2xl font-bold text-green-700">{spacingResult.totalPlants}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Garden Area</Badge>
                        <p className="text-lg font-semibold">{spacingResult.areaInSqFt} sq ft</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Plants per Row</Badge>
                        <p className="text-lg font-semibold">{spacingResult.plantsPerRow}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Number of Rows</Badge>
                        <p className="text-lg font-semibold">{spacingResult.numberOfRows}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Plants per Sq Ft</Badge>
                        <p className="text-lg font-semibold">{spacingResult.plantsPerSqFt}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Spacing in Feet</Badge>
                        <p className="text-lg font-semibold">{spacingResult.spacingInFt} ft</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seed Quantity Calculator */}
          <TabsContent value="seeds">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Seed Quantity Calculator
                </CardTitle>
                <CardDescription>
                  Calculate how many seeds you need based on area and germination rates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Garden Area (sq ft)</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="100"
                      value={seedCalc.area}
                      onChange={(e) => setSeedCalc({...seedCalc, area: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seedsPerSqFt">Seeds per Sq Ft</Label>
                    <Input
                      id="seedsPerSqFt"
                      type="number"
                      placeholder="4"
                      value={seedCalc.seedsPerSqFt}
                      onChange={(e) => setSeedCalc({...seedCalc, seedsPerSqFt: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="germinationRate">Germination Rate (%)</Label>
                    <Input
                      id="germinationRate"
                      type="number"
                      placeholder="85"
                      value={seedCalc.germinationRate}
                      onChange={(e) => setSeedCalc({...seedCalc, germinationRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plantType">Plant Type</Label>
                    <Select value={seedCalc.plantType} onValueChange={(value) => setSeedCalc({...seedCalc, plantType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="flowers">Flowers</SelectItem>
                        <SelectItem value="herbs">Herbs</SelectItem>
                        <SelectItem value="grass">Grass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={calculateSeedQuantity} className="w-full">
                  Calculate Seed Quantity
                </Button>

                {seedResult && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">Results:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Badge variant="secondary">Seeds Needed</Badge>
                        <p className="text-2xl font-bold text-blue-700">{seedResult.seedsNeeded}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Base Seeds</Badge>
                        <p className="text-lg font-semibold">{seedResult.totalSeeds}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Extra Seeds</Badge>
                        <p className="text-lg font-semibold">{seedResult.extraSeeds}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Germination Rate</Badge>
                        <p className="text-lg font-semibold">{seedResult.germinationRate}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Soil Volume Calculator */}
          <TabsContent value="soil">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Soil Volume Calculator
                </CardTitle>
                <CardDescription>
                  Calculate how much soil you need for raised beds and containers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shape">Bed Shape</Label>
                    <Select value={soilCalc.shape} onValueChange={(value) => setSoilCalc({...soilCalc, shape: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="circle">Circle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">
                      {soilCalc.shape === 'circle' ? 'Diameter (feet)' : 'Length (feet)'}
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="8"
                      value={soilCalc.length}
                      onChange={(e) => setSoilCalc({...soilCalc, length: e.target.value})}
                    />
                  </div>
                  {soilCalc.shape === 'rectangle' && (
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (feet)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="4"
                        value={soilCalc.width}
                        onChange={(e) => setSoilCalc({...soilCalc, width: e.target.value})}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="depth">Depth (inches)</Label>
                    <Input
                      id="depth"
                      type="number"
                      placeholder="12"
                      value={soilCalc.depth}
                      onChange={(e) => setSoilCalc({...soilCalc, depth: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button onClick={calculateSoilVolume} className="w-full">
                  Calculate Soil Volume
                </Button>

                {soilResult && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-3">Results:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Badge variant="secondary">Cubic Feet</Badge>
                        <p className="text-2xl font-bold text-amber-700">{soilResult.cubicFeet}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Cubic Yards</Badge>
                        <p className="text-lg font-semibold">{soilResult.cubicYards}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Bags Needed</Badge>
                        <p className="text-lg font-semibold">{soilResult.bags} bags</p>
                        <p className="text-xs text-gray-600">2 cu ft bags</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Watering Calculator */}
          <TabsContent value="water">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Watering Schedule Calculator
                </CardTitle>
                <CardDescription>
                  Calculate optimal watering schedules based on plant type, season, and soil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Garden Area (sq ft)</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="100"
                      value={waterCalc.area}
                      onChange={(e) => setWaterCalc({...waterCalc, area: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plantType">Plant Type</Label>
                    <Select value={waterCalc.plantType} onValueChange={(value) => setWaterCalc({...waterCalc, plantType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="flowers">Flowers</SelectItem>
                        <SelectItem value="herbs">Herbs</SelectItem>
                        <SelectItem value="lawn">Lawn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season">Season</Label>
                    <Select value={waterCalc.season} onValueChange={(value) => setWaterCalc({...waterCalc, season: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="fall">Fall</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={waterCalc.soilType} onValueChange={(value) => setWaterCalc({...waterCalc, soilType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sand">Sandy</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={calculateWatering} className="w-full">
                  Calculate Watering Schedule
                </Button>

                {waterResult && (
                  <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
                    <h3 className="font-semibold text-cyan-800 mb-3">Results:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Badge variant="secondary">Inches per Week</Badge>
                        <p className="text-2xl font-bold text-cyan-700">{waterResult.inchesPerWeek}"</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Gallons per Week</Badge>
                        <p className="text-lg font-semibold">{waterResult.gallonsPerWeek}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Minutes per Week</Badge>
                        <p className="text-lg font-semibold">{waterResult.minutesPerWeek}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Daily Minutes</Badge>
                        <p className="text-lg font-semibold">{waterResult.dailyMinutes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Garden Area Calculator */}
          <TabsContent value="area">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Garden Area Calculator
                </CardTitle>
                <CardDescription>
                  Calculate the area and perimeter of your garden beds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shape">Shape</Label>
                    <Select value={areaCalc.shape} onValueChange={(value) => setAreaCalc({...areaCalc, shape: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="triangle">Triangle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {areaCalc.shape === 'circle' ? (
                    <div className="space-y-2">
                      <Label htmlFor="radius">Radius (feet)</Label>
                      <Input
                        id="radius"
                        type="number"
                        placeholder="5"
                        value={areaCalc.radius}
                        onChange={(e) => setAreaCalc({...areaCalc, radius: e.target.value})}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="length">
                          {areaCalc.shape === 'triangle' ? 'Base (feet)' : 'Length (feet)'}
                        </Label>
                        <Input
                          id="length"
                          type="number"
                          placeholder="10"
                          value={areaCalc.length}
                          onChange={(e) => setAreaCalc({...areaCalc, length: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">
                          {areaCalc.shape === 'triangle' ? 'Height (feet)' : 'Width (feet)'}
                        </Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="8"
                          value={areaCalc.width}
                          onChange={(e) => setAreaCalc({...areaCalc, width: e.target.value})}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <Button onClick={calculateGardenArea} className="w-full">
                  Calculate Garden Area
                </Button>

                {areaResult && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-3">Results:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Badge variant="secondary">Square Feet</Badge>
                        <p className="text-2xl font-bold text-purple-700">{areaResult.squareFeet}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Acres</Badge>
                        <p className="text-lg font-semibold">{areaResult.acres}</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Perimeter</Badge>
                        <p className="text-lg font-semibold">{areaResult.perimeter} ft</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Harvest Calculator */}
          <TabsContent value="harvest">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5" />
                  Harvest Yield Calculator
                </CardTitle>
                <CardDescription>
                  Estimate your harvest yields based on crop type and number of plants.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop">Crop Type</Label>
                    <Select value={harvestCalc.crop} onValueChange={(value) => setHarvestCalc({...harvestCalc, crop: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tomatoes">Tomatoes</SelectItem>
                        <SelectItem value="peppers">Peppers</SelectItem>
                        <SelectItem value="lettuce">Lettuce</SelectItem>
                        <SelectItem value="beans">Beans</SelectItem>
                        <SelectItem value="carrots">Carrots</SelectItem>
                        <SelectItem value="cucumbers">Cucumbers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variety">Variety</Label>
                    <Select value={harvestCalc.variety} onValueChange={(value) => setHarvestCalc({...harvestCalc, variety: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {harvestCalc.crop === 'tomatoes' && (
                          <>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="cherry">Cherry</SelectItem>
                            <SelectItem value="beefsteak">Beefsteak</SelectItem>
                          </>
                        )}
                        {harvestCalc.crop === 'peppers' && (
                          <>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="hot">Hot</SelectItem>
                            <SelectItem value="bell">Bell</SelectItem>
                          </>
                        )}
                        {harvestCalc.crop === 'lettuce' && (
                          <>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="romaine">Romaine</SelectItem>
                            <SelectItem value="butterhead">Butterhead</SelectItem>
                          </>
                        )}
                        {harvestCalc.crop === 'beans' && (
                          <>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="pole">Pole</SelectItem>
                            <SelectItem value="bush">Bush</SelectItem>
                          </>
                        )}
                        {harvestCalc.crop === 'carrots' && (
                          <>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="baby">Baby</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </>
                        )}
                        {harvestCalc.crop === 'cucumbers' && (
                          <>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="pickling">Pickling</SelectItem>
                            <SelectItem value="slicing">Slicing</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plants">Number of Plants</Label>
                    <Input
                      id="plants"
                      type="number"
                      placeholder="10"
                      value={harvestCalc.plants}
                      onChange={(e) => setHarvestCalc({...harvestCalc, plants: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button onClick={calculateHarvest} className="w-full">
                  Calculate Harvest Yield
                </Button>

                {harvestResult && (
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                    <h3 className="font-semibold text-emerald-800 mb-3">Results:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Badge variant="secondary">Total Yield</Badge>
                        <p className="text-2xl font-bold text-emerald-700">{harvestResult.totalYield} lbs</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Weekly Yield</Badge>
                        <p className="text-lg font-semibold">{harvestResult.weeklyYield} lbs</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Harvest Period</Badge>
                        <p className="text-lg font-semibold">{harvestResult.weeksOfHarvest} weeks</p>
                      </div>
                      <div>
                        <Badge variant="secondary">Per Plant</Badge>
                        <p className="text-lg font-semibold">{harvestResult.yieldPerPlant} lbs</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <Separator className="mb-4" />
          <p>Garden Calculator - Your complete toolkit for successful gardening</p>
          <p className="mt-2">All calculations are estimates. Actual results may vary based on growing conditions.</p>
        </div>
      </div>
    </div>
  )
}

export default App

