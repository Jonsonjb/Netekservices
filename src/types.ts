export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  duration: string;
  level: 'Iniciante' | 'Intermédio' | 'Avançado';
  price: number; // 0 for Free, or amount in MT
  category: 'Gratuito' | 'Pago';
  skills: string[];
  instructor: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  basePrice: number; // in MT
  deliveryTime: string;
  category: string;
  iconName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown or rich HTML-friendly
  category: 'IA e Produtividade' | 'Conectividade' | 'Negócios e M-Pesa' | 'Economia de Dados';
  date: string;
  readTime: string;
  author: string;
  views: number;
}

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  type: 'Full-time' | 'Part-time' | 'Estágio' | 'Freelance' | 'Remoto';
  salaryRange?: string;
  contactEmailOrPhone: string;
  skillsRequired: string[];
  datePosted: string;
  isProfessionalProfile?: boolean; // True if it represent a professional looking for work rather than a vacancy
}

export interface FreeCourseSite {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: string;
  languages: string[];
  disciplines: string[];
  url: string;
  isPopularInMozambique: boolean;
}

export interface CvProfile {
  fullName: string;
  professionTitle: string;
  phone: string;
  email: string;
  location: string;
  gender: 'Feminino' | 'Masculino' | 'Prefiro não dizer';
  birthDate: string;
  objective: string;
  education: { institution: string; course: string; yearStarted: string; yearEnded: string }[];
  experience: { company: string; position: string; duration: string; mainTasks: string }[];
  skills: string[];
  languages: string[];
}

export interface LetterRequest {
  senderName: string;
  senderAddress: string;
  senderContact: string;
  recipientName: string; // e.g. "Director Geral da Vodacom Moçambique"
  recipientAddress: string;
  positionTitle: string; // e.g. "Gestor de Clientes de Retalho"
  reasonForApplication: string; // e.g. "candidatar-me à vaga de Estágio de Tecnologias anunciada no vosso portal"
  skillsToHighlight: string; // e.g. "conhecimentos sólidos de Microsoft Excel, hardware e atendimento comercial"
  letterType: 'pedido' | 'resposta' | 'estagio' | 'espontanea';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}


