# Smart School Dubai - Floor Map Editor

An advanced floor map editor with comprehensive geo-location capabilities for the Smart School Dubai project.

## 🌟 New Geo-Location Features

### 🎯 Four-Point Geo Calibration

- **Precise Mapping**: Pin four corner points of your floor map to real-world geo coordinates
- **Enhanced Accuracy**: Uses bilinear interpolation for accurate coordinate conversion
- **Visual Feedback**: Real-time accuracy percentage display
- **Easy Setup**: Step-by-step calibration wizard

### 🖱️ Real-Time Geo Cursor

- **Live Coordinates**: See real-time lat/lng coordinates as you move your mouse
- **Multiple Formats**: Display coordinates in decimal degrees or DMS format
- **Visual Indicator**: Crosshair cursor with coordinate overlay
- **Toggle Control**: Easy on/off toggle for the geo cursor

### 📍 Advanced Marker System

- **Multiple Types**: POI, Entrance, Exit, Facility, Emergency, and Custom markers
- **Geo-Positioned**: Markers are placed using precise geo coordinates
- **Rich Properties**: Name, description, type, and custom properties
- **Visual Management**: Color-coded markers with type-specific icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Angular 17+
- Modern web browser with Canvas support

### Installation

```bash
npm install
ng serve
```

## 📖 Usage Guide

### Setting Up Geo Calibration

1. **Start Calibration**

   - Click the "Start Calibration" button in the left sidebar
   - The editor will switch to calibration mode

2. **Set Corner Points**

   - Click on the **Top Left** corner of your map
   - Click on the **Top Right** corner
   - Click on the **Bottom Left** corner
   - Click on the **Bottom Right** corner

3. **Enter Coordinates**

   - For each point, enter the real-world latitude and longitude
   - Use precise coordinates for best accuracy

4. **Complete Calibration**
   - Click "Complete Calibration" when all points are set
   - The system will validate and activate the calibration

### Using the Geo Cursor

- **Enable**: The geo cursor is enabled by default
- **View Coordinates**: Move your mouse over the map to see live coordinates
- **Format Toggle**: Switch between decimal and DMS formats in settings
- **Toggle Visibility**: Use the toggle button to show/hide the cursor

### Adding Geo Markers

1. **Select Marker Tool**

   - Click the marker tool in the toolbar
   - Choose your desired marker type

2. **Place Marker**

   - Click anywhere on the map to place a marker
   - The marker will be positioned using geo coordinates

3. **Edit Properties**
   - Select a marker to edit its properties
   - Update name, description, and coordinates
   - Change marker type and styling

## 🛠️ Technical Features

### Four-Point Calibration System

```typescript
interface GeoCalibrationPoint {
  id: string;
  name: string;
  imageCoords: { x: number; y: number };
  geoCoords: { lat: number; lng: number };
  isSet: boolean;
}
```

### Enhanced Coordinate Conversion

- **Bilinear Interpolation**: Accurate coordinate transformation
- **Fallback Support**: Graceful degradation to simple two-point conversion
- **Accuracy Metrics**: Real-time calibration quality assessment

### Marker Management

```typescript
interface GeoMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "poi" | "entrance" | "exit" | "facility" | "emergency" | "custom";
  style: { color: string; size: number; icon: string };
  properties: { [key: string]: string | number | boolean };
}
```

## 🎨 UI Components

### Left Sidebar Enhancements

- **Tool Selection**: Extended with calibration and marker tools
- **Marker Type Selector**: Choose from predefined marker types
- **Calibration Controls**: Start, reset, and monitor calibration status

### Canvas Overlays

- **Geo Cursor**: Real-time coordinate display
- **Calibration Instructions**: Step-by-step guidance
- **Visual Indicators**: Calibration points and markers

### Right Sidebar Extensions

- **Marker List**: Manage all geo markers
- **Marker Properties**: Edit marker details and coordinates
- **Calibration Panel**: Set precise geo coordinates for calibration points

## 🔧 Configuration Options

```typescript
interface EditorConfig {
  showGeoCursor?: boolean; // Enable/disable geo cursor
  enableGeoCalibration?: boolean; // Allow calibration functionality
  enableGeoMarkers?: boolean; // Enable marker placement
  geoCoordinateFormat?: "decimal" | "dms"; // Coordinate display format
}
```

## 📊 Data Export

The enhanced floor map data includes:

```typescript
interface FloorMapData {
  // ... existing properties
  geoMarkers?: GeoMarker[];
  calibration?: {
    method: "two-point" | "four-point";
    points: GeoCalibrationPoint[];
    accuracy?: number;
  };
}
```

## 🎯 Use Cases

### Educational Institutions

- **Campus Navigation**: Mark important locations like libraries, labs, cafeterias
- **Emergency Planning**: Place emergency exits and safety equipment markers
- **Facility Management**: Track room capacities and department assignments

### Commercial Buildings

- **Visitor Guidance**: Mark entrances, elevators, and key facilities
- **Asset Tracking**: Geo-locate equipment and resources
- **Space Planning**: Accurate area measurements with geo context

## 🔍 Advanced Features

### Coordinate Accuracy

- **Calibration Quality**: Real-time accuracy percentage (70%+ recommended)
- **Point Distribution**: Better spread = higher accuracy
- **Validation**: Automatic validation of calibration points

### Export Formats

- **GeoJSON**: Standard geographic data format
- **JSON**: Complete floor map data with geo information
- **SVG**: Vector graphics with embedded geo data

## 🚀 Future Enhancements

- **GPS Integration**: Direct GPS coordinate input
- **Satellite Overlay**: Overlay satellite imagery for reference
- **Multi-Floor Support**: 3D building navigation
- **Real-time Tracking**: Live position tracking on floor maps

## 📝 API Reference

### Key Methods

```typescript
// Calibration
startCalibration(): void
resetCalibration(): void
setCalibrationPointGeoCoords(index: number, lat: number, lng: number): void

// Markers
createMarkerAtPoint(point: Point): void
selectMarker(id: string): void
deleteMarker(id: string): void

// Coordinate Conversion
imageToGeo(point: Point): { lat: number; lng: number }
geoToImage(lat: number, lng: number): Point
```

### Events

```typescript
@Output() calibrationComplete = new EventEmitter<CalibrationEvent>();
@Output() markerCreate = new EventEmitter<GeoMarker>();
@Output() markerClick = new EventEmitter<MarkerEvent>();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions about the geo-location features:

- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Smart School Dubai** - Empowering education through innovative technology solutions.
