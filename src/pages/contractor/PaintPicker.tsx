
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Sun, Moon, Download, Save, RotateCcw } from 'lucide-react';

const PaintPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [viewMode, setViewMode] = useState('day');

  const colorPalettes = {
    'Neutral': ['#F8F4F0', '#E5DDD5', '#D2C7BC', '#B8ACA0', '#9D8B7A'],
    'Warm': ['#FFF8E1', '#FFECB3', '#FFD54F', '#FF8F00', '#E65100'],
    'Cool': ['#E3F2FD', '#BBDEFB', '#64B5F6', '#1976D2', '#0D47A1'],
    'Earthy': ['#F1F8E9', '#DCEDC8', '#AED581', '#689F38', '#33691E'],
    'Bold': ['#FCE4EC', '#F8BBD9', '#E91E63', '#AD1457', '#880E4F']
  };

  const popularColors = [
    { name: 'Asian Paints Royale White', hex: '#FEFEFE', brand: 'Asian Paints' },
    { name: 'Berger Easy Clean Ivory', hex: '#FFF8DC', brand: 'Berger' },
    { name: 'Nerolac Beauty Smooth Beige', hex: '#F5F5DC', brand: 'Nerolac' },
    { name: 'Dulux Weathershield Cream', hex: '#FFFDD0', brand: 'Dulux' },
    { name: 'Asian Paints Tractor Emulsion Blue', hex: '#4682B4', brand: 'Asian Paints' },
    { name: 'Berger Silk Green', hex: '#90EE90', brand: 'Berger' }
  ];

  const savedCombinations = [
    { id: 1, name: 'Modern Living Room', walls: '#F0F0F0', trim: '#FFFFFF', accent: '#3B82F6' },
    { id: 2, name: 'Cozy Bedroom', walls: '#F5DEB3', trim: '#FFFFFF', accent: '#8B4513' },
    { id: 3, name: 'Elegant Kitchen', walls: '#F8F8FF', trim: '#E6E6FA', accent: '#4B0082' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Paint Picker & Visualizer</h1>
          <p className="text-gray-400">Choose colors and visualize them on your house walls</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setViewMode(viewMode === 'day' ? 'night' : 'day')}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            {viewMode === 'day' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
            {viewMode === 'day' ? 'Night View' : 'Day View'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Color Selection Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Selected Color */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Selected Color</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="w-full h-32 rounded-lg border border-gray-700"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <div className="text-center">
                <p className="text-white font-mono text-lg">{selectedColor}</p>
                <p className="text-gray-400 text-sm">Click on any color to select</p>
              </div>
            </CardContent>
          </Card>

          {/* Color Palettes */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Color Palettes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(colorPalettes).map(([category, colors]) => (
                <div key={category}>
                  <p className="text-sm text-gray-400 mb-2">{category}</p>
                  <div className="flex gap-2">
                    {colors.map((color, idx) => (
                      <button
                        key={idx}
                        className="w-8 h-8 rounded-full border border-gray-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Popular Brand Colors */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Popular Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularColors.map((color, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedColor(color.hex)}>
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-600"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{color.name}</p>
                    <Badge variant="secondary" className="text-xs">{color.brand}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* House Preview */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                House Preview
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {viewMode === 'day' ? 'Day View' : 'Night View'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`aspect-[4/3] rounded-lg border border-gray-700 relative ${viewMode === 'night' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {/* Simple house outline for demo */}
                <div className="absolute inset-4 flex flex-col items-center justify-center">
                  <div 
                    className="w-64 h-48 rounded-lg border-2 border-gray-600 relative"
                    style={{ backgroundColor: selectedColor, opacity: viewMode === 'night' ? 0.8 : 1 }}
                  >
                    {/* Windows */}
                    <div className="absolute top-8 left-8 w-16 h-12 bg-blue-200 border border-gray-500 rounded"></div>
                    <div className="absolute top-8 right-8 w-16 h-12 bg-blue-200 border border-gray-500 rounded"></div>
                    
                    {/* Door */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-20 bg-amber-800 border border-gray-500 rounded-t"></div>
                  </div>
                  
                  {/* Roof */}
                  <div className="w-72 h-16 bg-red-800 -mt-8 relative" style={{clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'}}>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 text-gray-400 text-sm">
                  Click and drag to apply colors to different parts
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Combinations */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Saved Color Combinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCombinations.map((combo) => (
                  <div key={combo.id} className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-white font-medium mb-2">{combo.name}</h3>
                    <div className="flex space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-4 h-4 rounded border border-gray-600"
                          style={{ backgroundColor: combo.walls }}
                        ></div>
                        <span className="text-xs text-gray-400">Walls</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-4 h-4 rounded border border-gray-600"
                          style={{ backgroundColor: combo.trim }}
                        ></div>
                        <span className="text-xs text-gray-400">Trim</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-4 h-4 rounded border border-gray-600"
                          style={{ backgroundColor: combo.accent }}
                        ></div>
                        <span className="text-xs text-gray-400">Accent</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10">
                      Apply Combination
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Current Design
            </Button>
            <Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10">
              <Download className="h-4 w-4 mr-2" />
              Download Preview
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintPicker;
