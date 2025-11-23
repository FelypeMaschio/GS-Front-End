import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, Trophy, Users, ArrowRight, Building2, User } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Ganhe XP',
      description: 'cumule experiência completando desafios e missões',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Suba de Nível',
      description: 'Progresso contínuo com sistema de níveis gamificado',
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Conquiste Badges',
      description: 'Desbloqueie insígnias especiais ao atingir marcos',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Compita com Colegas',
      description: 'Desafie seus colegas e suba no ranking global',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Bem-vindo ao <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LevelUp Work</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            A plataforma gamificada que transforma aprendizado corporativo em uma jornada épica de crescimento e desenvolvimento profissional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login/empresa"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <Building2 className="w-5 h-5" />
              Login Empresa
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login/usuario"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <User className="w-5 h-5" />
              Login Usuário
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Cadastre-se aqui
            </Link>
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center hover:shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <div className="flex justify-center mb-4 text-blue-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Siga estes passos simples para começar sua jornada de aprendizado gamificado
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-3"
        >
          {[
            { step: '1', title: 'Crie sua Conta', desc: 'Registre-se e personalize seu perfil' },
            { step: '2', title: 'Escolha Desafios', desc: 'Selecione desafios que te interessam' },
            { step: '3', title: 'Ganhe Recompensas', desc: 'Complete tarefas e suba de nível' },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Junte-se a milhares de profissionais que estão transformando sua carreira
          </p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Entrar no Jogo Agora <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
