import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Search, Filter } from 'lucide-react';
import type { Challenge } from '../types';
import { CardDesafio } from '../components/CardDesafio';

// Mock data expandido para demonstração
const mockDesafios: Challenge[] = [
  {
    id: '1',
    title: 'Fundamentos de React',
    description: 'Aprenda os conceitos básicos do React e como criar componentes reutilizáveis',
    category: 'Frontend',
    difficulty: 'easy',
    xpReward: 100,
    progress: 100,
    completed: true,
  },
  {
    id: '2',
    title: 'TypeScript Avançado',
    description: 'Domine tipos, genéricos e padrões avançados em TypeScript',
    category: 'Backend',
    difficulty: 'hard',
    xpReward: 300,
    progress: 60,
    completed: false,
  },
  {
    id: '3',
    title: 'TailwindCSS Masterclass',
    description: 'Crie interfaces bonitas e responsivas com TailwindCSS',
    category: 'Frontend',
    difficulty: 'medium',
    xpReward: 200,
    progress: 30,
    completed: false,
  },
  {
    id: '4',
    title: 'Node.js API REST',
    description: 'Construa APIs RESTful escaláveis com Node.js e Express',
    category: 'Backend',
    difficulty: 'medium',
    xpReward: 250,
    progress: 45,
    completed: false,
  },
  {
    id: '5',
    title: 'Banco de Dados SQL',
    description: 'Aprenda SQL, normalização e otimização de consultas',
    category: 'Backend',
    difficulty: 'medium',
    xpReward: 200,
    progress: 75,
    completed: false,
  },
  {
    id: '6',
    title: 'Git e GitHub',
    description: 'Domine versionamento de código e colaboração em projetos',
    category: 'DevOps',
    difficulty: 'easy',
    xpReward: 150,
    progress: 100,
    completed: true,
  },
  {
    id: '7',
    title: 'Docker Essentials',
    description: 'Containerize suas aplicações com Docker',
    category: 'DevOps',
    difficulty: 'hard',
    xpReward: 350,
    progress: 20,
    completed: false,
  },
  {
    id: '8',
    title: 'React Hooks Avançados',
    description: 'Crie hooks personalizados e otimize performance',
    category: 'Frontend',
    difficulty: 'hard',
    xpReward: 300,
    progress: 50,
    completed: false,
  },
  {
    id: '9',
    title: 'Responsividade Mobile',
    description: 'Desenvolva interfaces mobile-first e responsivas',
    category: 'Frontend',
    difficulty: 'easy',
    xpReward: 120,
    progress: 85,
    completed: false,
  },
];

export default function Desafios() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockDesafios);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('todos');
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    xpReward: 100,
  });

  // Filtrar desafios
  const filteredChallenges = challenges.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDifficulty = filterDifficulty === 'todos' || c.difficulty === filterDifficulty;
    const matchCategory = filterCategory === 'todos' || c.category === filterCategory;
    const matchStatus = 
      filterStatus === 'todos' ||
      (filterStatus === 'completos' && c.completed) ||
      (filterStatus === 'pendentes' && !c.completed);
    
    return matchSearch && matchDifficulty && matchCategory && matchStatus;
  });

  // Obter categorias únicas
  const categories = ['todos', ...new Set(challenges.map(c => c.category))];

  // Estatísticas
  const stats = {
    total: challenges.length,
    completed: challenges.filter(c => c.completed).length,
    pending: challenges.filter(c => !c.completed).length,
    totalXp: challenges.reduce((sum, c) => sum + (c.completed ? c.xpReward : 0), 0),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const updated = challenges.map(c =>
        c.id === editingId
          ? { ...c, ...formData }
          : c
      );
      setChallenges(updated);
      setEditingId(null);
    } else {
      const newChallenge: Challenge = {
        ...formData,
        id: Date.now().toString(),
        progress: 0,
        completed: false,
      };
      setChallenges([...challenges, newChallenge]);
    }

    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: 'medium',
      xpReward: 100,
    });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setChallenges(challenges.filter(c => c.id !== id));
  };

  const handleEdit = (challenge: Challenge) => {
    setFormData({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      xpReward: challenge.xpReward,
    });
    setEditingId(challenge.id);
    setShowModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="section-container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
        >
          <div>
            <h1 className="heading-2 mb-2">
              Desafios
            </h1>
            <p className="subheading">
              Escolha seus desafios e comece a ganhar XP
            </p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                category: '',
                difficulty: 'medium',
                xpReward: 100,
              });
            }}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Novo Desafio
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: stats.total, color: 'from-blue-500 to-blue-600' },
            { label: 'Concluídos', value: stats.completed, color: 'from-green-500 to-green-600' },
            { label: 'Pendentes', value: stats.pending, color: 'from-yellow-500 to-yellow-600' },
            { label: 'XP Ganho', value: stats.totalXp, color: 'from-purple-500 to-purple-600' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`card bg-gradient-to-br ${stat.color} text-white`}
            >
              <p className="text-sm opacity-90 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar desafios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base pl-10"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Dificuldade
            </label>
            <div className="flex flex-wrap gap-2">
              {['todos', 'easy', 'medium', 'hard'].map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setFilterDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterDifficulty === difficulty
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {difficulty === 'todos' ? 'Todas' : difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterCategory === category
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category === 'todos' ? 'Todas' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {['todos', 'completos', 'pendentes'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-accent text-gray-900 shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : status === 'completos' ? 'Concluídos' : 'Pendentes'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Challenges Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence>
            {filteredChallenges.map(challenge => (
              <div key={challenge.id} className="relative group">
                <CardDesafio challenge={challenge} />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => handleEdit(challenge)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    title="Deletar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredChallenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted text-lg">
              Nenhum desafio encontrado com este filtro
            </p>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card shadow-xl max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="heading-3 mb-6">
                  {editingId ? 'Editar Desafio' : 'Novo Desafio'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={3}
                      className="input-base resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoria
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="input-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dificuldade
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={e => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                        className="input-base"
                      >
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      XP Recompensa
                    </label>
                    <input
                      type="number"
                      value={formData.xpReward}
                      onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
                      required
                      className="input-base"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      {editingId ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
