// UI-layer mapping: ProductIconKey → Lucide icon component.
// Icon components are NOT stored in the data layer.

import {
  Package, Sparkles, Star, Gift,
  Heart, Droplets, Leaf, Box, ShoppingBag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ProductIconKey, ProductTheme } from '@/types/product';

export const PRODUCT_ICON_MAP: Record<ProductIconKey, LucideIcon> = {
  Package, Sparkles, Star, Gift,
  Heart, Droplets, Leaf, Box, ShoppingBag,
};

export const PRODUCT_THEME_CLASSES: Record<ProductTheme, { iconBg: string; iconColor: string; badgeBg: string; badgeText: string }> = {
  primary: {
    iconBg:    'bg-primary-soft',
    iconColor: 'text-primary',
    badgeBg:   'bg-primary/15',
    badgeText: 'text-primary',
  },
  gold: {
    iconBg:    'bg-[#FEF9C3]',
    iconColor: 'text-gold',
    badgeBg:   'bg-gold/20',
    badgeText: 'text-gold',
  },
};
