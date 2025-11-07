# Browser Support

SenangWebs Yield (SWY) aims to support all modern browsers and recent versions. Below is the detailed compatibility matrix.

## Supported Browsers

| Browser        | Minimum Version | Status             | Notes                            |
| -------------- | --------------- | ------------------ | -------------------------------- |
| Chrome         | 60              | ✅ Fully Supported | Recommended                      |
| Firefox        | 55              | ✅ Fully Supported |                                  |
| Safari         | 11              | ✅ Fully Supported | macOS 10.12.6+                   |
| Edge           | 15              | ✅ Fully Supported | Chromium-based (79+) recommended |
| Opera          | 47              | ✅ Fully Supported | Based on Chrome                  |
| iOS Safari     | 11              | ✅ Fully Supported |                                  |
| Chrome Mobile  | 60              | ✅ Fully Supported |                                  |
| Firefox Mobile | 55              | ✅ Fully Supported |                                  |
| Edge Mobile    | 15              | ✅ Fully Supported |                                  |

## Feature Support

### ES6 Features

SWY uses modern JavaScript (ES6+) features that are transpiled for older browsers:

| Feature           | Chrome 60 | Firefox 55 | Safari 11 | Edge 15 |
| ----------------- | --------- | ---------- | --------- | ------- |
| Arrow Functions   | ✅        | ✅         | ✅        | ✅      |
| Classes           | ✅        | ✅         | ✅        | ✅      |
| Template Literals | ✅        | ✅         | ✅        | ✅      |
| const/let         | ✅        | ✅         | ✅        | ✅      |
| Modules           | ✅        | ✅         | ✅        | ✅      |
| Promise           | ✅        | ✅         | ✅        | ✅      |

### Web APIs

| API             | Status       | Notes                                   |
| --------------- | ------------ | --------------------------------------- |
| CSS3            | ✅ Supported | Used for chart rendering and animations |
| DOM Selection   | ✅ Supported | querySelector/querySelectorAll          |
| Event Listeners | ✅ Supported | addEventListener                        |
| Data Attributes | ✅ Supported | dataset property                        |
| ResizeObserver  | ⚠️ Partial   | Fallback to window.resize               |

## Desktop Browsers

### Chrome

- **Minimum:** Version 60 (April 2018)
- **Tested:** Latest 3 versions
- **Status:** Fully supported

### Firefox

- **Minimum:** Version 55 (August 2017)
- **Tested:** Latest 3 versions
- **Status:** Fully supported

### Safari

- **Minimum:** Version 11 (September 2017)
- **MacOS:** 10.12.6 or later
- **Tested:** Latest 2 versions
- **Status:** Fully supported

### Edge

- **Minimum (Legacy):** Version 15 (April 2017)
- **Modern (Chromium):** Version 79 (January 2020)
- **Recommended:** Use Chromium-based Edge (79+)
- **Status:** Fully supported

## Mobile Browsers

### iOS Safari

- **Minimum:** iOS 11
- **Tested:** iOS 14+
- **Status:** Fully supported

### Chrome Mobile

- **Minimum:** Version 60
- **Tested:** Latest versions
- **Status:** Fully supported

### Firefox Mobile

- **Minimum:** Version 55
- **Tested:** Latest versions
- **Status:** Fully supported

### Samsung Internet

- **Minimum:** Version 8.0
- **Status:** Fully supported

## Unsupported Browsers

### Internet Explorer

- **Status:** ❌ Not Supported
- **Reason:** IE11 lacks ES6 support required by SWY
- **Alternative:** Use legacy-compatible charting library

### Very Old Versions

- **Chrome < 60**
- **Firefox < 55**
- **Safari < 11**
- **Edge < 15**

**Note:** If you must support older browsers, consider using an older version of SWY with polyfills.

## Known Issues

### Mobile Rotation

- Charts may not resize on device rotation
- **Workaround:** Call `SWY.reinitialize()` on orientationchange event

### Legacy Browser CSS Support

- Some older browsers may have issues with CSS conic-gradient (pie charts)
- **Fallback:** Pie charts gracefully degrade on unsupported browsers

## Device Support

| Device Category | Status             | Notes                                   |
| --------------- | ------------------ | --------------------------------------- |
| Desktop         | ✅ Fully Supported | 1920x1080+, 24"+ screens                |
| Laptop          | ✅ Fully Supported | 1366x768+, 13"-15" screens              |
| Tablet          | ✅ Supported       | iPad, Android tablets (7"+ recommended) |
| Mobile          | ✅ Supported       | iPhone 6+, Android 5+ phones            |
| Large Displays  | ✅ Supported       | 4K monitors, TV displays                |
| Small Screens   | ⚠️ Partial         | < 320px width (very limited)            |

### Mobile Considerations

1. **Touch Support:** Use mouse/touch events - SWY charts don't have touch gestures
2. **Screen Size:** Recommended minimum 320px width
3. **Orientation:** Test both portrait and landscape
4. **Performance:** May vary on low-end devices

## Testing Checklist

- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)
- [ ] Test on iOS Safari (latest)
- [ ] Test on Chrome Mobile (latest)
- [ ] Test on tablet (landscape and portrait)
- [ ] Test on older browser versions (if targeting legacy support)

## Polyfills Required

For older browsers, the following polyfills may be needed:

```html
<!-- For IE11 support (not recommended) -->
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
```

However, **IE11 is not officially supported** due to ES6 class requirements.

## Performance Notes

### Render Performance

- **Target:** 60 FPS
- **Tested Data Points:** Up to 100 per chart
- **Multiple Charts:** Up to 10 charts per page

### Memory Usage

- **Typical Overhead:** < 50KB (minified)
- **Per Chart:** ~10-50KB depending on data size

### Browser-Specific Performance

| Browser | CSS Rendering | Animation Performance |
| ------- | ------------- | --------------------- |
| Chrome  | Excellent     | Excellent             |
| Firefox | Good          | Good                  |
| Safari  | Good          | Good                  |
| Edge    | Good          | Excellent             |

## Version History

| Version | Release Date | Min Browser Versions        | Notes           |
| ------- | ------------ | --------------------------- | --------------- |
| 1.0.0   | 2025-11      | Chrome 60, FF 55, Safari 11 | Initial release |

## Getting Help

If you encounter browser compatibility issues:

1. Check the [GitHub Issues](https://github.com/senangwebs/senangwebs-yield/issues)
2. Enable debug mode: `SWY.setDebugMode(true)`
3. Check browser console for errors
4. Verify you're using a supported browser version

## Reporting Issues

When reporting browser compatibility issues, please include:

- Browser name and version
- Operating system
- Error message from console
- Minimal reproduction code
- Screenshot if applicable
