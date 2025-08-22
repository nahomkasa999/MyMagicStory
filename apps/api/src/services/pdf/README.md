# Enhanced PDF Generation System

This enhanced PDF generation system provides high-quality, print-ready PDF creation with web-optimized preview generation for the MyMagicStory platform.

## Features

- **High-Resolution PDF Generation**: Creates print-ready PDFs with CMYK color profiles and proper bleed settings
- **Custom Typography**: Advanced text rendering with custom fonts, alignment, and spacing
- **Image Processing**: Optimized image embedding with Sharp for color profile conversion
- **Web Preview Generation**: Creates WebP previews for fast web display
- **Canvas-Based Rendering**: Precise layout control using Node.js Canvas
- **Progressive Loading**: Generates blurred variants for progressive image loading

## Architecture

```
Enhanced PDF System
├── types.ts           # TypeScript definitions and Zod schemas
├── generator.ts       # Core PDF generation logic
├── preview.ts         # WebP preview generation
└── index.ts          # Service exports
```

## Usage

### Basic PDF Generation

```typescript
import { EnhancedPDFGenerator } from '../services/pdf';

const generator = new EnhancedPDFGenerator();

const layout = {
  title: "My Story",
  subtitle: "A magical adventure",
  pages: [
    {
      type: "text",
      content: "Once upon a time...",
      linkToPrevious: false,
      style: {
        fontSize: 18,
        fontFamily: "Helvetica",
        color: "#000000",
        alignment: "center",
        margin: { top: 50, bottom: 50, left: 50, right: 50 }
      }
    }
  ],
  settings: {
    pageSize: { width: 595.28, height: 841.89 }, // A4
    bleed: 9, // 3mm bleed
    colorProfile: "CMYK",
    resolution: 300
  }
};

const pages = [
  { text: "Once upon a time...", style: layout.pages[0].style }
];

const result = await generator.generatePDF(layout, pages, {
  outputFormat: "print",
  generatePreviews: true,
  uploadToStorage: true
});
```

### Preview Generation

```typescript
import { PreviewGenerator } from '../services/pdf';

const previewGenerator = new PreviewGenerator();

// Generate canvas-based previews
const previews = await previewGenerator.generateCanvasPreviews(pages, {
  width: 800,
  height: 1000,
  backgroundColor: "#ffffff"
});

// Generate WebP previews with blurred variants
const webPPreviews = await previewGenerator.generateWebPPreviews(pdfBuffer, {
  quality: 80,
  width: 800,
  generateBlurred: true
});
```

## API Endpoints

### Generate PDF
```
POST /post-data/:id
```
Creates a high-quality PDF from a template with enhanced rendering.

**Response Headers:**
- `X-Page-Count`: Number of pages in the PDF
- `X-File-Size`: File size in bytes

### Generate Previews
```
POST /generate-previews
```
Creates WebP previews for web display.

**Request Body:**
```json
{
  "storybookId": "uuid",
  "options": {
    "quality": 80,
    "width": 800,
    "generateBlurred": true
  }
}
```

### Get Previews
```
GET /previews/:storybookId
```
Retrieves existing preview URLs.

## Configuration

### Page Settings

```typescript
settings: {
  pageSize: { 
    width: 595.28,  // A4 width in points
    height: 841.89  // A4 height in points
  },
  bleed: 9,           // Bleed in points (3mm)
  colorProfile: "CMYK", // "RGB" or "CMYK"
  resolution: 300     // DPI for images
}
```

### Text Styling

```typescript
style: {
  fontSize: 18,
  fontFamily: "Helvetica", // "Helvetica", "Helvetica-Bold", "Times-Roman"
  color: "#000000",
  alignment: "center",     // "left", "center", "right"
  margin: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  }
}
```

### Image Styling

```typescript
style: {
  fit: "cover",        // "cover", "contain", "fill"
  position: { x: 0, y: 0 },
  size: {
    width: 400,        // Optional: specific width
    height: 300        // Optional: specific height
  }
}
```

## Dependencies

### Required Packages
- `pdf-lib`: Core PDF manipulation
- `@pdf-lib/fontkit`: Custom font support
- `sharp`: Image processing and optimization
- `canvas`: Server-side canvas rendering

### System Dependencies (Linux)
```bash
sudo apt install -y build-essential libcairo2-dev libpango1.0-dev \
  libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev
```

## Performance Considerations

### PDF Generation
- **Memory Usage**: Large images and many pages increase memory usage
- **Processing Time**: CMYK conversion and high-resolution rendering take time
- **File Size**: Print-quality PDFs are larger than web-optimized versions

### Preview Generation
- **Caching**: Generated previews are cached in Supabase Storage
- **Progressive Loading**: Blurred variants enable fast initial loading
- **CDN**: Leverage Supabase CDN for global preview delivery

## Error Handling

The system includes comprehensive error handling:

```typescript
try {
  const result = await generator.generatePDF(layout, pages, options);
} catch (error) {
  if (error.message.includes('Font not found')) {
    // Handle font loading errors
  } else if (error.message.includes('Image processing failed')) {
    // Handle image processing errors
  } else {
    // Handle general PDF generation errors
  }
}
```

## Future Enhancements

### Planned Features
1. **Custom Font Loading**: Support for uploading and using custom fonts
2. **Advanced CMYK Conversion**: Proper color profile conversion for print
3. **PDF to Image Conversion**: Direct PDF page to WebP conversion
4. **Template Caching**: Cache compiled templates for faster generation
5. **Batch Processing**: Generate multiple PDFs in parallel
6. **Quality Presets**: Predefined settings for different use cases

### Integration Points
- **Supabase Storage**: For preview and PDF storage
- **Cloudinary**: Alternative image processing pipeline
- **Print APIs**: Integration with print-on-demand services
- **Analytics**: Track generation performance and usage

## Troubleshooting

### Common Issues

**Canvas Installation Fails**
```bash
# Install system dependencies first
sudo apt update
sudo apt install -y build-essential libcairo2-dev libpango1.0-dev \
  libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev

# Then install Node packages
pnpm install
```

**Memory Issues with Large PDFs**
- Reduce image resolution in settings
- Process pages in batches
- Increase Node.js memory limit: `--max-old-space-size=4096`

**Font Loading Errors**
- Ensure font files are accessible
- Check font file format compatibility
- Verify fontkit registration

**CMYK Color Issues**
- Currently using RGB with high quality
- Full CMYK support requires additional color management libraries
- Consider using ICC color profiles for accurate conversion

## Testing

```typescript
// Test PDF generation
const testLayout = {
  title: "Test Story",
  pages: [
    {
      type: "text",
      content: "Test content",
      linkToPrevious: false,
      style: { /* default styles */ }
    }
  ],
  settings: { /* default settings */ }
};

const result = await generator.generatePDF(testLayout, [], {
  outputFormat: "web", // Faster for testing
  generatePreviews: false,
  uploadToStorage: false
});

console.log(`Generated PDF: ${result.metadata.fileSize} bytes`);