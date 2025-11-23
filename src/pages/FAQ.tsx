import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Send } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'O que é LevelUp ork?',
    answer: 'LevelUp Work é uma plataforma gamificada de aprendizagem corporativa que transforma o processo de aprendizado em uma jornada épica, com missões, desafios, recompensas e progressão de níveis.',
  },
  {
    id: '2',
    question: 'Como funciona o sistema de XP?',
    answer: 'Você ganha XP (experiência) ao completar desafios e missões. Cada desafio tem uma quantidade específica de XP que você recebe ao finalizá-lo. Quanto mais XP você acumula, mais perto você fica de subir de nível.',
  },
  {
    id: '3',
    question: 'O que são badges?',
    answer: 'Badges são insígnias especiais que você desbloqueia ao atingir marcos específicos ou completar desafios especiais. Elas representam suas conquistas e habilidades dentro da plataforma.',
  },
  {
    id: '4',
    question: 'Como faço para subir de nível?',
    answer: 'Para subir de nível, você precisa acumular uma quantidade específica de XP. Cada nível requer mais XP que o anterior. Você pode acompanhar seu progresso no dashboard.',
  },
  {
    id: '5',
    question: 'Posso criar meus próprios desafios?',
    answer: 'Sim! Na seção de Desafios, você pode criar novos desafios personalizados. Defina o título, descrição, dificuldade e recompensa em XP.',
  },
  {
    id: '6',
    question: 'Como funciona o ranking?',
    answer: 'O ranking é baseado no total de XP que você acumula. Quanto mais desafios você completa, maior é seu XP total e melhor sua posição no ranking global.',
  },
  {
    id: '7',
    question: 'Posso editar ou deletar desafios?',
    answer: 'Sim! Você pode editar ou deletar desafios que criou. Basta passar o mouse sobre o card do desafio e clicar nos botões de editar ou deletar.',
  },
  {
    id: '8',
    question: 'Como mudo o tema da plataforma?',
    answer: 'Clique no ícone de lua/sol no topo da página para alternar entre o modo claro e escuro. Sua preferência será salva automaticamente.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="section-container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="heading-2 mb-4">
            Perguntas Frequentes
          </h1>
          <p className="subheading max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre LevelUp Work
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="space-y-4 max-w-3xl mx-auto mb-16"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex items-center justify-between hover:text-primary transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {item.question}
                </h3>
                <motion.div
                  animate={{ rotate: openId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-primary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 max-w-3xl mx-auto"
        >
          <h2 className="heading-3 mb-4 text-center">
            Não encontrou sua resposta?
          </h2>
          <p className="text-muted text-center mb-8">
            Entre em contato conosco através do formulário abaixo
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mensagem
              </label>
              <textarea
                placeholder="Sua mensagem..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="input-base resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {submitted ? '✓ Enviado com sucesso!' : (
                <>
                  Enviar Mensagem <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
