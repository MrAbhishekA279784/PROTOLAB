import React, { useState, useEffect } from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface SafeIconProps extends LucideProps {
  icon: LucideIcon;
}

export function SafeIcon({ icon: Icon, ...props }: SafeIconProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: props.size || 24, height: props.size || 24 }} />;
  }

  return <Icon {...props} />;
}
