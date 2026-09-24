import {
  Wifi, Waves, UtensilsCrossed, Car, ConciergeBell, Snowflake, Dumbbell, Flower2,
  Wine, Plane, Shirt, Zap, PawPrint, Briefcase, Baby, Flame, Trees, Tv,
  Coffee, BedDouble, ShieldCheck, Sparkles, Mountain, Sun, Bath, Cigarette,
} from 'lucide-react';

/** Mirrors the admin icon set; amenities store the key. */
const ICONS = {
  Wifi, Waves, UtensilsCrossed, Car, ConciergeBell, Snowflake, Dumbbell, Flower2,
  Wine, Plane, Shirt, Zap, PawPrint, Briefcase, Baby, Flame, Trees, Tv,
  Coffee, BedDouble, ShieldCheck, Sparkles, Mountain, Sun, Bath, Cigarette,
};

export const iconFor = (name) => ICONS[name] || ConciergeBell;
