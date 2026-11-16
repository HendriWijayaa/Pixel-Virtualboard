export interface DeviceInfo {
  name: string;
  brand: 'apple' | 'samsung' | 'google' | 'xiaomi' | 'oneplus' | 'oppo' | 'vivo' | 'infinix' | 'generic';
  brandLabel: string;
  os: 'iOS' | 'Android' | 'Windows' | 'Mac' | 'Linux' | 'Other';
  resolution: string;
  browser: string;
  isMobile: boolean;
  batteryPercent: number;
  gpu?: string;
}

/**
 * Detect host computer info (OS, platform, browser) to show on connected smartphones
 */
export function detectHostComputer(): string {
  if (typeof window === 'undefined') return 'Komputer / Laptop';

  const ua = navigator.userAgent;
  let osName = 'Komputer';

  if (/Windows NT 10.0/i.test(ua)) {
    osName = 'Windows 11 / 10 PC';
  } else if (/Windows/i.test(ua)) {
    osName = 'Windows PC';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    osName = 'MacBook / Mac';
  } else if (/CrOS/i.test(ua)) {
    osName = 'Chromebook';
  } else if (/Linux/i.test(ua)) {
    osName = 'Linux PC';
  }

  let browserName = 'Browser';
  if (/Edg/i.test(ua)) {
    browserName = 'Edge';
  } else if (/Chrome/i.test(ua)) {
    browserName = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browserName = 'Safari';
  } else if (/Firefox/i.test(ua)) {
    browserName = 'Firefox';
  }

  return `${osName} (${browserName})`;
}

/**
 * Get GPU Unmasked Renderer info via WebGL
 * Real phones report e.g. "Adreno (TM) 750", "Mali-G680", "Apple GPU", "Mali-G68", etc.
 */
export function getWebGLRenderer(): string {
  if (typeof window === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return '';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
  } catch {
    return '';
  }
}

/**
 * Comprehensive resolution of hardware model code, user-agent, GPU, and viewport
 * to exact smartphone marketing models.
 */
export function resolveModelCodeToName(
  modelCode: string,
  userAgent: string,
  gpu: string = '',
  screenWidth: number = 0,
  screenHeight: number = 0,
  dpr: number = 1
): { name: string; brand: DeviceInfo['brand']; brandLabel: string } {
  const code = (modelCode || '').toUpperCase().trim();
  const ua = (userAgent || '').toUpperCase();
  const gpuUpper = (gpu || '').toUpperCase();

  // 1. Samsung Galaxy S-Series (Flagships)
  if (code.includes('SM-S928') || ua.includes('SM-S928') || code.includes('S928')) {
    return { name: 'Samsung Galaxy S24 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S926') || ua.includes('SM-S926') || code.includes('S926')) {
    return { name: 'Samsung Galaxy S24+', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S921') || ua.includes('SM-S921') || code.includes('S921')) {
    return { name: 'Samsung Galaxy S24', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S918') || ua.includes('SM-S918') || code.includes('S918')) {
    return { name: 'Samsung Galaxy S23 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S916') || ua.includes('SM-S916') || code.includes('S916')) {
    return { name: 'Samsung Galaxy S23+', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S911') || ua.includes('SM-S911') || code.includes('S911')) {
    return { name: 'Samsung Galaxy S23', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S908') || ua.includes('SM-S908') || code.includes('S908')) {
    return { name: 'Samsung Galaxy S22 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S906') || ua.includes('SM-S906') || code.includes('S906')) {
    return { name: 'Samsung Galaxy S22+', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-S901') || ua.includes('SM-S901') || code.includes('S901')) {
    return { name: 'Samsung Galaxy S22', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-G998') || ua.includes('SM-G998')) {
    return { name: 'Samsung Galaxy S21 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-G996') || ua.includes('SM-G996')) {
    return { name: 'Samsung Galaxy S21+', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-G991') || ua.includes('SM-G991')) {
    return { name: 'Samsung Galaxy S21', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-G990') || ua.includes('SM-G990')) {
    return { name: 'Samsung Galaxy S21 FE', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-G780') || code.includes('SM-G781')) {
    return { name: 'Samsung Galaxy S20 FE', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-N986') || ua.includes('SM-N986')) {
    return { name: 'Samsung Galaxy Note 20 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
  }

  // Samsung Foldables
  if (code.includes('SM-F956') || ua.includes('SM-F956')) {
    return { name: 'Samsung Galaxy Z Fold 6', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-F741') || ua.includes('SM-F741')) {
    return { name: 'Samsung Galaxy Z Flip 6', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-F946') || ua.includes('SM-F946')) {
    return { name: 'Samsung Galaxy Z Fold 5', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-F936') || ua.includes('SM-F936')) {
    return { name: 'Samsung Galaxy Z Fold 4', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-F731') || ua.includes('SM-F731')) {
    return { name: 'Samsung Galaxy Z Flip 5', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-F721') || ua.includes('SM-F721')) {
    return { name: 'Samsung Galaxy Z Flip 4', brand: 'samsung', brandLabel: 'Samsung' };
  }

  // Samsung Galaxy A-Series (Specific variants)
  if (code.includes('SM-A556') || ua.includes('SM-A556') || code.includes('A556')) {
    return { name: 'Samsung Galaxy A55 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A546') || ua.includes('SM-A546') || code.includes('A546')) {
    return { name: 'Samsung Galaxy A54 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A536') || ua.includes('SM-A536') || code.includes('A536')) {
    return { name: 'Samsung Galaxy A53 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A528') || ua.includes('SM-A528')) {
    return { name: 'Samsung Galaxy A52s 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A356') || ua.includes('SM-A356') || code.includes('A356')) {
    return { name: 'Samsung Galaxy A35 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A346') || ua.includes('SM-A346') || code.includes('A346')) {
    return { name: 'Samsung Galaxy A34 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A256') || ua.includes('SM-A256') || code.includes('A256')) {
    return { name: 'Samsung Galaxy A25 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A245') || ua.includes('SM-A245')) {
    return { name: 'Samsung Galaxy A24', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A156') || ua.includes('SM-A156')) {
    return { name: 'Samsung Galaxy A15 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A155') || ua.includes('SM-A155')) {
    return { name: 'Samsung Galaxy A15', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A146') || ua.includes('SM-A146')) {
    return { name: 'Samsung Galaxy A14 5G', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A145') || ua.includes('SM-A145')) {
    return { name: 'Samsung Galaxy A14', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-A057') || code.includes('SM-A055')) {
    return { name: 'Samsung Galaxy A05s', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.includes('SM-M546') || code.includes('SM-M346')) {
    return { name: 'Samsung Galaxy M-Series', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (code.startsWith('SM-')) {
    return { name: `Samsung Galaxy (${code})`, brand: 'samsung', brandLabel: 'Samsung' };
  }

  // 2. Google Pixel (strictly Google Pixel hardware/UA only)
  if (code.includes('PIXEL 9 PRO XL') || ua.includes('PIXEL 9 PRO XL')) return { name: 'Google Pixel 9 Pro XL', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 9 PRO FOLD') || ua.includes('PIXEL 9 PRO FOLD')) return { name: 'Google Pixel 9 Pro Fold', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 9 PRO') || ua.includes('PIXEL 9 PRO')) return { name: 'Google Pixel 9 Pro', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 9A') || ua.includes('PIXEL 9A')) return { name: 'Google Pixel 9a', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 9') || ua.includes('PIXEL 9')) return { name: 'Google Pixel 9', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 8 PRO') || ua.includes('PIXEL 8 PRO')) return { name: 'Google Pixel 8 Pro', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 8A') || ua.includes('PIXEL 8A')) return { name: 'Google Pixel 8a', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 8') || ua.includes('PIXEL 8')) return { name: 'Google Pixel 8', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 7 PRO') || ua.includes('PIXEL 7 PRO')) return { name: 'Google Pixel 7 Pro', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 7A') || ua.includes('PIXEL 7A')) return { name: 'Google Pixel 7a', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 7') || ua.includes('PIXEL 7')) return { name: 'Google Pixel 7', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 6 PRO') || ua.includes('PIXEL 6 PRO')) return { name: 'Google Pixel 6 Pro', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 6A') || ua.includes('PIXEL 6A')) return { name: 'Google Pixel 6a', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 6') || ua.includes('PIXEL 6')) return { name: 'Google Pixel 6', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL FOLD') || ua.includes('PIXEL FOLD')) return { name: 'Google Pixel Fold', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 5A') || ua.includes('PIXEL 5A')) return { name: 'Google Pixel 5a', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 5') || ua.includes('PIXEL 5')) return { name: 'Google Pixel 5', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 4A') || ua.includes('PIXEL 4A')) return { name: 'Google Pixel 4a', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 4 XL') || ua.includes('PIXEL 4 XL')) return { name: 'Google Pixel 4 XL', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL 4') || ua.includes('PIXEL 4')) return { name: 'Google Pixel 4', brand: 'google', brandLabel: 'Google' };
  if (code.includes('PIXEL') || ua.includes('PIXEL')) return { name: 'Google Pixel', brand: 'google', brandLabel: 'Google' };

  // 3. Xiaomi / POCO / Redmi
  if (code.includes('24030PN60G') || ua.includes('14 ULTRA')) return { name: 'Xiaomi 14 Ultra', brand: 'xiaomi', brandLabel: 'Xiaomi' };
  if (code.includes('23127PN0') || ua.includes('23127PN0')) return { name: 'Xiaomi 14 Pro', brand: 'xiaomi', brandLabel: 'Xiaomi' };
  if (code.includes('23122') || ua.includes('23122') || ua.includes('XIAOMI 14')) return { name: 'Xiaomi 14', brand: 'xiaomi', brandLabel: 'Xiaomi' };
  if (code.includes('23078PND5G') || ua.includes('13T PRO')) return { name: 'Xiaomi 13T Pro', brand: 'xiaomi', brandLabel: 'Xiaomi' };
  if (code.includes('2306EPN60G') || ua.includes('13T')) return { name: 'Xiaomi 13T', brand: 'xiaomi', brandLabel: 'Xiaomi' };
  if (code.includes('2210132G') || ua.includes('2210132G')) return { name: 'Xiaomi 13 Ultra', brand: 'xiaomi', brandLabel: 'Xiaomi' };
  if (code.includes('2211133G') || ua.includes('2211133G') || ua.includes('XIAOMI 13')) return { name: 'Xiaomi 13', brand: 'xiaomi', brandLabel: 'Xiaomi' };

  // POCO
  if (code.includes('24069PC21G') || code.includes('POCO F6 PRO') || ua.includes('POCO F6 PRO')) return { name: 'POCO F6 Pro', brand: 'xiaomi', brandLabel: 'POCO' };
  if (code.includes('24053PY09G') || code.includes('POCO F6') || ua.includes('POCO F6')) return { name: 'POCO F6', brand: 'xiaomi', brandLabel: 'POCO' };
  if (code.includes('23013PC75G') || ua.includes('POCO F5 PRO')) return { name: 'POCO F5 Pro', brand: 'xiaomi', brandLabel: 'POCO' };
  if (code.includes('23049PCD8G') || ua.includes('POCO F5')) return { name: 'POCO F5', brand: 'xiaomi', brandLabel: 'POCO' };
  if (code.includes('2311DRK48G') || code.includes('POCO X6 PRO') || ua.includes('POCO X6 PRO')) return { name: 'POCO X6 Pro 5G', brand: 'xiaomi', brandLabel: 'POCO' };
  if (code.includes('23122PCD1') || code.includes('POCO X6') || ua.includes('POCO X6')) return { name: 'POCO X6 5G', brand: 'xiaomi', brandLabel: 'POCO' };
  if (code.includes('2312FPCA6G') || ua.includes('POCO M6 PRO')) return { name: 'POCO M6 Pro', brand: 'xiaomi', brandLabel: 'POCO' };

  // Redmi
  if (code.includes('23090RA98G') || code.includes('REDMI NOTE 13 PRO+') || ua.includes('REDMI NOTE 13 PRO+')) return { name: 'Redmi Note 13 Pro+ 5G', brand: 'xiaomi', brandLabel: 'Redmi' };
  if (code.includes('2312DRA50G') || code.includes('REDMI NOTE 13 PRO') || ua.includes('REDMI NOTE 13 PRO')) return { name: 'Redmi Note 13 Pro 5G', brand: 'xiaomi', brandLabel: 'Redmi' };
  if (code.includes('23124RA7EO') || code.includes('23129RAA4G') || ua.includes('REDMI NOTE 13')) return { name: 'Redmi Note 13', brand: 'xiaomi', brandLabel: 'Redmi' };
  if (code.includes('22101316G') || ua.includes('REDMI NOTE 12')) return { name: 'Redmi Note 12', brand: 'xiaomi', brandLabel: 'Redmi' };
  if (code.includes('2201116SG') || ua.includes('REDMI NOTE 11')) return { name: 'Redmi Note 11', brand: 'xiaomi', brandLabel: 'Redmi' };
  if (code.includes('23100RN82L') || ua.includes('REDMI 13C')) return { name: 'Redmi 13C', brand: 'xiaomi', brandLabel: 'Redmi' };

  // 4. OnePlus
  if (code.includes('CPH2581') || ua.includes('CPH2581') || ua.includes('ONEPLUS 12')) return { name: 'OnePlus 12', brand: 'oneplus', brandLabel: 'OnePlus' };
  if (code.includes('CPH2585') || ua.includes('CPH2585') || ua.includes('12R')) return { name: 'OnePlus 12R', brand: 'oneplus', brandLabel: 'OnePlus' };
  if (code.includes('CPH2449') || ua.includes('CPH2449') || ua.includes('ONEPLUS 11')) return { name: 'OnePlus 11', brand: 'oneplus', brandLabel: 'OnePlus' };
  if (code.includes('CPH2493') || ua.includes('NORD 3')) return { name: 'OnePlus Nord 3', brand: 'oneplus', brandLabel: 'OnePlus' };

  // 5. OPPO & Realme
  if (code.includes('CPH2553') || code.includes('CPH2599') || ua.includes('RENO 11')) return { name: 'OPPO Reno 11 5G', brand: 'oppo', brandLabel: 'OPPO' };
  if (code.includes('CPH2525') || ua.includes('RENO 10')) return { name: 'OPPO Reno 10 5G', brand: 'oppo', brandLabel: 'OPPO' };
  if (code.includes('CPH2481') || ua.includes('FIND N3')) return { name: 'OPPO Find N3', brand: 'oppo', brandLabel: 'OPPO' };
  if (code.includes('CPH2557') || ua.includes('A79')) return { name: 'OPPO A79 5G', brand: 'oppo', brandLabel: 'OPPO' };
  if (code.includes('CPH2577') || ua.includes('A58')) return { name: 'OPPO A58', brand: 'oppo', brandLabel: 'OPPO' };
  if (code.startsWith('CPH')) {
    return { name: `OPPO (${code})`, brand: 'oppo', brandLabel: 'OPPO' };
  }

  // Realme
  if (code.includes('RMX3840') || ua.includes('REALME 12 PRO+')) return { name: 'Realme 12 Pro+ 5G', brand: 'oppo', brandLabel: 'Realme' };
  if (code.includes('RMX3867') || ua.includes('REALME 12+')) return { name: 'Realme 12+ 5G', brand: 'oppo', brandLabel: 'Realme' };
  if (code.includes('RMX3771') || ua.includes('REALME 11 PRO+')) return { name: 'Realme 11 Pro+ 5G', brand: 'oppo', brandLabel: 'Realme' };
  if (code.includes('RMX3890') || ua.includes('REALME C67')) return { name: 'Realme C67', brand: 'oppo', brandLabel: 'Realme' };
  if (code.includes('RMX3710') || ua.includes('REALME C55')) return { name: 'Realme C55', brand: 'oppo', brandLabel: 'Realme' };
  if (code.startsWith('RMX')) {
    return { name: `Realme (${code})`, brand: 'oppo', brandLabel: 'Realme' };
  }

  // 6. Vivo & iQOO
  if (code.includes('V2303') || code.includes('V2324') || ua.includes('X100 PRO')) return { name: 'Vivo X100 Pro', brand: 'vivo', brandLabel: 'Vivo' };
  if (code.includes('V2307') || code.includes('V2318') || ua.includes('V30')) return { name: 'Vivo V30 5G', brand: 'vivo', brandLabel: 'Vivo' };
  if (code.includes('V2250') || ua.includes('V29')) return { name: 'Vivo V29 5G', brand: 'vivo', brandLabel: 'Vivo' };
  if (code.includes('V2249') || ua.includes('Y36')) return { name: 'Vivo Y36', brand: 'vivo', brandLabel: 'Vivo' };
  if (code.includes('I2208') || ua.includes('IQOO 12')) return { name: 'iQOO 12', brand: 'vivo', brandLabel: 'iQOO' };
  if (code.startsWith('V2')) {
    return { name: `Vivo (${code})`, brand: 'vivo', brandLabel: 'Vivo' };
  }

  // 7. Infinix & Tecno
  if (code.includes('X6871') || ua.includes('GT 20 PRO')) return { name: 'Infinix GT 20 Pro', brand: 'infinix', brandLabel: 'Infinix' };
  if (code.includes('X6827') || ua.includes('GT 10 PRO')) return { name: 'Infinix GT 10 Pro', brand: 'infinix', brandLabel: 'Infinix' };
  if (code.includes('X6850') || ua.includes('NOTE 40 PRO')) return { name: 'Infinix Note 40 Pro', brand: 'infinix', brandLabel: 'Infinix' };
  if (code.includes('X6833') || ua.includes('NOTE 30')) return { name: 'Infinix Note 30', brand: 'infinix', brandLabel: 'Infinix' };
  if (code.includes('X6836') || ua.includes('ZERO 30')) return { name: 'Infinix Zero 30', brand: 'infinix', brandLabel: 'Infinix' };
  if (code.includes('X6831') || ua.includes('HOT 30')) return { name: 'Infinix Hot 30', brand: 'infinix', brandLabel: 'Infinix' };
  if (code.includes('X6853') || ua.includes('HOT 40 PRO')) return { name: 'Infinix Hot 40 Pro', brand: 'infinix', brandLabel: 'Infinix' };
  if (code.startsWith('X68') || code.startsWith('X67')) {
    return { name: `Infinix (${code})`, brand: 'infinix', brandLabel: 'Infinix' };
  }
  if (code.includes('CK8') || code.includes('LH8') || code.includes('TECNO') || ua.includes('TECNO')) {
    return { name: 'Tecno Spark / Camon', brand: 'generic', brandLabel: 'Tecno' };
  }

  // 8. If model code is explicitly non-generic and not just "K" or "ANDROID"
  if (code && code !== 'K' && code !== 'ANDROID' && code !== 'LINUX' && code.length > 2) {
    return { name: code, brand: 'generic', brandLabel: 'Android' };
  }

  // 9. Hardware GPU Inspection fallback (When Chrome completely freezes User-Agent to "Android 10; K")
  if (gpuUpper) {
    if (gpuUpper.includes('ADRENO') && gpuUpper.includes('750')) {
      return { name: 'Samsung Galaxy S24 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
    }
    if (gpuUpper.includes('ADRENO') && gpuUpper.includes('740')) {
      return { name: 'Samsung Galaxy S23 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
    }
    if (gpuUpper.includes('ADRENO') && gpuUpper.includes('730')) {
      return { name: 'Samsung Galaxy S22 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
    }
    if (gpuUpper.includes('MALI-G680') || gpuUpper.includes('XCLIPSE 530')) {
      return { name: 'Samsung Galaxy A55 5G', brand: 'samsung', brandLabel: 'Samsung' };
    }
    if (gpuUpper.includes('MALI-G68')) {
      return { name: 'Samsung Galaxy A54 5G', brand: 'samsung', brandLabel: 'Samsung' };
    }
    if (gpuUpper.includes('MALI-G610')) {
      return { name: 'POCO X6 Pro 5G', brand: 'xiaomi', brandLabel: 'POCO' };
    }
    if (gpuUpper.includes('MALI-G57')) {
      return { name: 'Infinix / Redmi Smartphone', brand: 'infinix', brandLabel: 'Infinix' };
    }
    if (gpuUpper.includes('ADRENO') && gpuUpper.includes('660')) {
      return { name: 'Samsung Galaxy S21', brand: 'samsung', brandLabel: 'Samsung' };
    }
    if (gpuUpper.includes('ADRENO') && (gpuUpper.includes('642') || gpuUpper.includes('619'))) {
      return { name: 'Xiaomi / Galaxy A-Series', brand: 'xiaomi', brandLabel: 'Xiaomi' };
    }
    if (gpuUpper.includes('APPLE')) {
      return { name: 'Apple iPhone', brand: 'apple', brandLabel: 'Apple' };
    }
  }

  // 10. Viewport Screen Dimension matching for specific flagships
  const maxDim = Math.max(screenWidth, screenHeight);
  const minDim = Math.min(screenWidth, screenHeight);

  if (maxDim === 919 && minDim === 412) {
    return { name: 'Samsung Galaxy S24 Ultra', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (maxDim === 873 && minDim === 393) {
    return { name: 'Samsung Galaxy A54 / A55', brand: 'samsung', brandLabel: 'Samsung' };
  }
  if (maxDim === 854 && minDim === 384) {
    return { name: 'Samsung Galaxy S24', brand: 'samsung', brandLabel: 'Samsung' };
  }

  return { name: 'Android Smartphone', brand: 'generic', brandLabel: 'Android' };
}

/**
 * Returns true strictly if the detected device is a Google Pixel device.
 */
export function isGooglePixelDevice(device: DeviceInfo | null | undefined): boolean {
  if (!device) return false;
  return device.brand === 'google' || /google\s+pixel|\bpixel\b/i.test(device.name);
}

// Synchronous device detection fallback
export function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      name: 'Smartphone',
      brand: 'generic',
      brandLabel: 'Generic',
      os: 'Other',
      resolution: '1080 × 2400',
      browser: 'Web',
      isMobile: true,
      batteryPercent: 88,
    };
  }

  const ua = navigator.userAgent;
  const width = window.screen.width;
  const height = window.screen.height;
  const dpr = window.devicePixelRatio || 1;
  const resolution = `${Math.round(width * dpr)} × ${Math.round(height * dpr)}`;
  const gpu = getWebGLRenderer();

  let name = 'Smartphone';
  let brand: DeviceInfo['brand'] = 'generic';
  let brandLabel = 'Smartphone';
  let os: DeviceInfo['os'] = 'Other';
  const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(ua);

  // 1. Detect OS
  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
    brand = 'apple';
    brandLabel = 'Apple';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
  } else if (/Mac/i.test(ua)) {
    os = 'Mac';
  } else if (/Win/i.test(ua)) {
    os = 'Windows';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  // 2. Specific iPhone detection based on viewport & DPR
  if (os === 'iOS') {
    const maxDim = Math.max(width, height);
    const minDim = Math.min(width, height);

    if (maxDim === 932 && minDim === 430) {
      name = 'iPhone 15 Pro Max';
    } else if (maxDim === 852 && minDim === 393) {
      name = 'iPhone 15 Pro';
    } else if (maxDim === 926 && minDim === 428) {
      name = 'iPhone 14 Plus';
    } else if (maxDim === 844 && minDim === 390) {
      name = 'iPhone 15';
    } else if (maxDim === 896 && minDim === 414) {
      name = 'iPhone 11 Pro Max';
    } else if (maxDim === 812 && minDim === 375) {
      name = 'iPhone 13 mini';
    } else {
      name = 'Apple iPhone';
    }
  } else if (os === 'Android') {
    const resolved = resolveModelCodeToName('', ua, gpu, width, height, dpr);
    name = resolved.name;
    brand = resolved.brand;
    brandLabel = resolved.brandLabel;
  }

  // Detect browser
  let browser = 'Browser';
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edg/i.test(ua)) browser = 'Edge';

  const batteryPercent = 90;

  return {
    name,
    brand,
    brandLabel,
    os,
    resolution,
    browser,
    isMobile,
    batteryPercent,
    gpu,
  };
}

// Asynchronous detection querying UserAgent Client Hints getHighEntropyValues
export async function detectDeviceAsync(): Promise<DeviceInfo> {
  const base = detectDevice();

  // Attempt Chromium UserAgentData High Entropy Client Hints
  try {
    const nav = navigator as unknown as {
      userAgentData?: {
        getHighEntropyValues?: (hints: string[]) => Promise<{
          model?: string;
          platform?: string;
          platformVersion?: string;
          architecture?: string;
          brands?: Array<{ brand: string; version: string }>;
        }>;
      };
    };

    if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === 'function') {
      const hints = await nav.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion', 'architecture']);
      if (hints.model) {
        const resolved = resolveModelCodeToName(
          hints.model,
          navigator.userAgent,
          base.gpu || '',
          window.screen.width,
          window.screen.height,
          window.devicePixelRatio || 1
        );
        base.name = resolved.name;
        base.brand = resolved.brand;
        base.brandLabel = resolved.brandLabel;
      }
    }
  } catch (err) {
    console.warn('Could not query userAgentData:', err);
  }

  return base;
}
