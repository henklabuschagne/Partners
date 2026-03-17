# Iframe Integration Guide

This Partner Management application is fully configured to support iframe embedding in your internal applications.

## ✅ Iframe Embedding Enabled

The application has been configured to allow iframe embedding from any origin:

- **Content Security Policy**: Set to `frame-ancestors *` to allow embedding from any domain
- **No X-Frame-Options**: The app does not set restrictive frame options
- **Cross-origin compatible**: Works with different domains and protocols

## Basic Embedding

### Simple Iframe Example

```html
<iframe 
  src="https://your-partner-portal-url.com"
  width="100%"
  height="800px"
  frameborder="0"
  style="border: none;"
  title="Partner Management Portal"
></iframe>
```

### Responsive Iframe

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://your-partner-portal-url.com"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Partner Management Portal"
  ></iframe>
</div>
```

## Advanced Integration

### PostMessage Communication

The app sends messages to the parent window that you can listen for:

#### App Ready Event
When the app finishes loading:

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'PARTNER_MANAGEMENT_READY') {
    console.log('Partner portal is ready!');
    console.log('Version:', event.data.version);
  }
});
```

#### Height Change Events
To dynamically adjust iframe height:

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'HEIGHT_CHANGE') {
    const iframe = document.getElementById('partner-portal-iframe');
    iframe.style.height = event.data.height + 'px';
  }
});
```

### Sending Messages to the Embedded App

You can send messages to the embedded app from your parent application:

```javascript
const iframe = document.getElementById('partner-portal-iframe');
iframe.contentWindow.postMessage({
  type: 'YOUR_CUSTOM_MESSAGE',
  data: { /* your data */ }
}, '*');
```

## Direct Navigation

You can link directly to specific sections of the app:

- Dashboard: `/`
- Partners: `/partners`
- Contracts: `/contracts`
- Invoices: `/invoices`
- Analytics: `/analytics`

### Example with Direct Navigation

```html
<iframe 
  src="https://your-partner-portal-url.com/analytics"
  width="100%"
  height="800px"
  frameborder="0"
  title="Partner Analytics"
></iframe>
```

## Security Considerations

### For Internal Use Only

While this app allows embedding from any origin (`frame-ancestors *`), it's designed for internal use:

1. **Deploy behind authentication**: Ensure your hosting environment requires authentication
2. **Use VPN/Internal network**: Host on internal infrastructure
3. **Environment variables**: Use environment-specific configurations for production
4. **Access controls**: Implement user authentication and authorization

### Production Recommendations

For production deployment, consider:

1. **Restrict frame-ancestors**: Limit to specific domains
2. **HTTPS only**: Always serve over HTTPS
3. **CORS policies**: Configure appropriate CORS headers
4. **Content validation**: Validate postMessage communications

## Testing Iframe Embedding Locally

Create a test HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Partner Portal Test</title>
</head>
<body style="margin: 0; padding: 20px; font-family: system-ui;">
  <h1>Partner Management Portal (Embedded)</h1>
  
  <div id="status"></div>
  
  <iframe 
    id="partner-portal"
    src="http://localhost:3000"
    width="100%"
    height="900px"
    style="border: 1px solid #ccc; border-radius: 8px;"
    title="Partner Management Portal"
  ></iframe>

  <script>
    window.addEventListener('message', (event) => {
      const status = document.getElementById('status');
      
      if (event.data.type === 'PARTNER_MANAGEMENT_READY') {
        status.innerHTML = '✅ Portal loaded successfully!';
        status.style.color = 'green';
        status.style.padding = '10px';
        status.style.background = '#e6ffe6';
        status.style.borderRadius = '4px';
        status.style.marginBottom = '20px';
      }
    });
  </script>
</body>
</html>
```

## Troubleshooting

### Issue: Iframe not loading
- Check if the URL is correct and accessible
- Verify network connectivity
- Check browser console for errors

### Issue: Content Security Policy errors
- Ensure the hosting server doesn't override CSP headers
- Check that your parent application allows iframe content

### Issue: Communication not working
- Verify both apps are using `postMessage` correctly
- Check origin restrictions in message handlers
- Ensure CORS is properly configured

## Support

For issues or questions about iframe integration:
1. Check browser console for error messages
2. Verify the app is accessible directly (outside iframe)
3. Test with the provided test HTML file above
4. Review postMessage event handling in both applications

## Summary

✅ **Iframe embedding**: Fully enabled  
✅ **PostMessage API**: Supported for communication  
✅ **Direct routing**: All routes accessible  
✅ **No restrictions**: Works with any parent domain  
✅ **Production ready**: With proper security measures
