import React, { useEffect, useState } from 'react';
import { useTheme } from "next-themes";

interface KonciiLogoProps {
  className?: string;
  size?: number;
}

const KonciiLogo: React.FC<KonciiLogoProps> = ({ className = "", size = 40 }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid layout shift while waiting for the theme
    return <div style={{ width: size, height: size }} />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logoSrc = currentTheme === 'dark' 
    ? '/assets/images/dark_mode.png' 
    : '/assets/images/light_mode.png';

  return (
    <img
      src={logoSrc}
      alt="Koncii Logo"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default KonciiLogo;
