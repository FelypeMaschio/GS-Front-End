import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Award, Code2, Database, Bot, TrendingUp, Users } from 'lucide-react';
import type { TeamMember } from '../types';
// Importação de React para garantir o namespace e usar React.ReactElement
import React from 'react'; 

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Natan Freitas de Moraes',
    rm: '564992',
    role: 'JAVA e ChatBot',
    class: 'FIAP 2025/2',
    github: 'https://github.com/nfreitas2000',
    linkedin: 'https://www.linkedin.com/in/natanfreitasdemoraes',
    photo: '/Natan Freitas Moraes.jpeg',
  },
  {
    id: '2',
    name: 'Felype Ferreira Maschio',
    rm: '563009',
    role: 'Front-End e Banco de Dados',
    class: 'FIAP 2025/2',
    github: 'https://github.com/FelypeMaschio',
    linkedin: 'https://www.linkedin.com/in/felype-ferreira-maschio-735842286/',
    photo: '/Felype Ferreira Maschio.png',
  },
  {
    id: '3',
    name: 'Fellipe Costa de Oliveira',
    rm: '564673',
    role: 'Python e Business Intelligence',
    class: 'FIAP 2025/2',
    github: 'https://github.com/FellipeCostaOliveira',
    linkedin: 'https://www.linkedin.com/in/fellipe-costa-aab114355/',
    photo: '/Fellipe Costa de Oliveira.png',
  },
];

const roleIcons: Record<string, React.ReactElement> = {
  'JAVA e ChatBot': <Bot className="w-5 h-5" />,
  'Front-End e Banco de Dados': <Code2 className="w-5 h-5" />,
  'Python e Business Intelligence': <TrendingUp className="w-5 h-5" />,
};

export default function Integrantes() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedMember, setHighlightedMember] = useState<string | null>(null);

  useEffect(() => {
    setMembers(mockMembers);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando integrantes...</p>
        </div>
      </div>
    );
  }

  const toggleHighlight = (id: string) => {
    setHighlightedMember(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Nosso Time
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Conheça os desenvolvedores por trás do <span className="font-semibold text-indigo-600 dark:text-indigo-400">LevelUp Work</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Clique em um membro para destacá-lo
          </p>
        </motion.div>

        {/* Project Info Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl shadow-2xl p-8 mb-16 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Projeto LevelUp Work - FIAP 2025/2</h2>
          </div>
          <p className="text-lg leading-relaxed opacity-95">
            Plataforma gamificada de desenvolvimento profissional que conecta colaboradores e empresas através de desafios, conquistas e progressão de carreira. Desenvolvido com React, TypeScript, Tailwind CSS e integração com APIs REST.
          </p>
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {members.map((member) => {
            const isHighlighted = highlightedMember === member.id;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => toggleHighlight(member.id)}
                className={`cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center ${
                  isHighlighted ? 'ring-4 ring-indigo-500 dark:ring-indigo-400 scale-105' : ''
                }`}
              >
                {/* Photo with gradient border */}
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-lg opacity-50"></div>
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="relative w-36 h-36 rounded-full mx-auto object-cover border-4 border-white dark:border-gray-700 shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-avatar.png';
                    }}
                  />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>

                {/* RM Badge */}
                <div className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  RM: {member.rm}
                </div>

                {/* Role with Icon */}
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  {roleIcons[member.role]}
                  <p className="font-medium">{member.role}</p>
                </div>

                {/* Class */}
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {member.class}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200 group"
                    aria-label={`GitHub de ${member.name}`}
                  >
                    <Github className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                  </a>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-all duration-200 group"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-200" />
                  </a>
                  <a 
                    href={`mailto:${member.name.toLowerCase().replace(/\s+/g, '.')}@email.com`}
                    className="p-3 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-full transition-all duration-200 group"
                    aria-label={`Email de ${member.name}`}
                  >
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-300 group-hover:text-green-700 dark:group-hover:text-green-200" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Technologies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-3">
            <Code2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Tecnologias Utilizadas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'React', version: '18.x', color: 'from-cyan-400 to-blue-500' },
              { name: 'TypeScript', version: '5.x', color: 'from-blue-500 to-indigo-600' },
              { name: 'Tailwind', version: '3.x', color: 'from-teal-400 to-cyan-500' },
              { name: 'Vite', version: '7.x', color: 'from-purple-500 to-pink-500' },
              { name: 'Java', version: '17+', color: 'from-orange-500 to-red-500' },
              { name: 'Python', version: '3.x', color: 'from-yellow-400 to-yellow-600' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${tech.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{tech.name[0]}</span>
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">{tech.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{tech.version}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Responsibilities Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-3">
            <Database className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Distribuição de Responsabilidades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Backend & IA',
                description: 'Java, Chatbot, APIs REST',
                icon: <Bot className="w-8 h-8" />,
                color: 'from-orange-400 to-red-500',
              },
              {
                title: 'Análise & Dados',
                description: 'Python, Business Intelligence, Analytics',
                icon: <TrendingUp className="w-8 h-8" />,
                color: 'from-yellow-400 to-orange-500',
              },
              {
                title: 'Frontend & DB',
                description: 'React, TypeScript, Oracle Database',
                icon: <Code2 className="w-8 h-8" />,
                color: 'from-blue-400 to-indigo-600',
              },
            ].map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${area.color} flex items-center justify-center text-white`}>
                  {area.icon}
                </div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{area.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
