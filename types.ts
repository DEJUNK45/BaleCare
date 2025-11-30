import { LucideIcon } from 'lucide-react';

export type Language = 'id' | 'en';

export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  color: string;
  price: string;
}

export interface Review {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface FormData {
  name: string;
  phone: string;
  address: string;
  date: string;
  description: string;
}

export interface TranslationData {
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  servicesTitle: string;
  servicesSubtitle: string;
  whyUsTitle: string;
  testimoniTitle: string;
  bookModalTitle: string;
  nameLabel: string;
  phoneLabel: string;
  addressLabel: string;
  dateLabel: string;
  descLabel: string;
  submitButton: string;
  successTitle: string;
  successMsg: string;
  footerText: string;
  categories: Record<string, string>;
  aiSectionTitle: string;
  aiDiagnoseTitle: string;
  aiDiagnoseDesc: string;
  aiVillaTitle: string;
  aiVillaDesc: string;
  aiModalDiagnoseTitle: string;
  aiModalVillaTitle: string;
  aiInputPlaceholder: string;
  aiVillaPlaceholder: string;
  analyzeButton: string;
  generateButton: string;
  loading: string;
  aiResultLabel: string;
  copyText: string;
  bookRecommended: string;
  addReviewBtn: string;
  reviewModalTitle: string;
  reviewNamePlaceholder: string;
  reviewTextPlaceholder: string;
  submitReviewBtn: string;
  reviewSuccessBtn: string;
  closeBtn: string;
  loginBtn: string;
  logoutBtn: string;
  welcomeUser: string;
  guestName: string;
  guestLoginTitle: string;
  guestLoginMsg: string;
}