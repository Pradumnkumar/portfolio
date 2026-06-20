import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-dark-card/50 transition-colors">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3">Pradumn Kumar</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Senior software engineer with 5+ years building real-time data systems and embedded solutions. Expert in system design, full-stack development, and cloud-native architectures.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Connect</h3>
            <div className="flex gap-4">
              <a href="https://github.com/pradumnkumar6" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="GitHub">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/pradumnkumar/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="mailto:pradumnkumar6@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
            © {currentYear} Pradumn Kumar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
