const fetch = require('node-fetch');

async function testImageUpload() {
  console.log('🧪 Testing image upload functionality...');
  
  try {
    // Test 1: Create a test image file (1x1 pixel PNG)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI';
    
    // Create a mock file object
    const testFile = {
      name: 'test-image.png',
      type: 'image/png',
      size: 1024, // 1KB
      arrayBuffer: Buffer.from(testImageData.split(',')[1], 'base64')
    };
    
    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', testFile, 'test-image.png');
    
    // Send upload request
    const response = await fetch('http://localhost:3002/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload test successful!');
      console.log('📋 Response:', result);
      
      // Test 2: Verify file was created
      if (result.fileUrl) {
        console.log('🖼️ Image URL generated:', result.fileUrl);
        console.log('📁 File name:', result.filename);
        console.log('📏 File size:', result.size);
      } else {
        console.log('❌ Upload failed:', result);
      }
    } else {
      console.log('❌ Upload request failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testImageUpload();
