import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">LevelUp Work</h3>
            <p className="text-gray-400">
              Plataforma gamificada de aprendizagem corporativa para o futuro do trabalho.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition">Desafios</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} LevelUp Work. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Desenvolvido para a Global Solution 2025/2 - FIAP</p>
        </div>
      </div>
    </footer>
  );
};
