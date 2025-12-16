import { Lightbulb, BookOpen, Download, Library } from 'lucide-react';

export const FEATURES = [
  {
    title: 'AI-Powerd Writing',
    description:
      "Overcome writer's block with our smart assistant that helps you generate ideas into e-books ",
    icon: Lightbulb,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Immersive Reader',
    description:
      'Preview your eboo in clean,read-only format. Adjust font sizes for comfort reading',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'One-click-Export',
    description: 'Export your e-book to PDF,DOCX instantly ,ready to publishing',
    icon: Download,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'E-Book Management',
    description:
      ' Organise all your ebooks projects in a personal dashboard,Easy trac ,Edit drafs and manage your books.',
    icon: Library,
    gradient: 'from-pink-500 to-rose-600',
  },
];
