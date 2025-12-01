import { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // 🎨 Cores principais
    colorPrimary: '#1E88E5',      // Azul Clínico Primário
    colorSuccess: '#43A047',       // Verde Saúde
    colorWarning: '#F9A825',       // Alerta
    colorError: '#C62828',         // Erro (uso reduzido)
    colorInfo: '#0288D1',          // Info
    
    // Cores de texto
    colorText: '#1A1A1A',          // Preto Médico
    colorTextSecondary: '#424242', // Cinza Escuro
    colorTextTertiary: '#9E9E9E',  // Cinza Médio
    colorTextQuaternary: '#9E9E9E',
    
    // Background
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#E3F2FD',      // Azul Muito Claro
    colorBgSpotlight: '#BBDEFB',   // Azul Pastel
    
    // Bordas
    colorBorder: '#E0E0E0',        // Cinza Claro
    colorBorderSecondary: '#E0E0E0',
    
    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Font
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 28,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    
    // Sombras
    boxShadow: '0 2px 8px rgba(30, 136, 229, 0.1)',
    boxShadowSecondary: '0 4px 16px rgba(30, 136, 229, 0.15)',
    
    // Motion
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.15s',
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      algorithm: true,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingBlock: 8,
      paddingInline: 12,
    },
    Select: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Table: {
      headerBg: '#E3F2FD',
      headerColor: '#1A1A1A',
      rowHoverBg: '#BBDEFB',
      borderColor: '#E0E0E0',
    },
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary: '0 2px 8px rgba(30, 136, 229, 0.1)',
    },
    Menu: {
      itemBg: 'transparent',
      itemHoverBg: 'rgba(255, 255, 255, 0.1)',
      itemSelectedBg: 'rgba(255, 255, 255, 0.2)',
      itemSelectedColor: '#FFFFFF',
      itemColor: 'rgba(255, 255, 255, 0.85)',
      iconSize: 18,
      itemHeight: 48,
      itemMarginBlock: 4,
      itemBorderRadius: 8,
    },
    Layout: {
      siderBg: '#1565C0',
      headerBg: '#FFFFFF',
      headerHeight: 64,
      headerPadding: '0 24px',
    },
    Modal: {
      borderRadiusLG: 12,
      headerBg: '#E3F2FD',
    },
    Notification: {
      borderRadiusLG: 12,
    },
    Message: {
      contentBg: '#FFFFFF',
    },
  },
};
