import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-white/10 bg-[#07080f]/80 backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 text-white font-bold text-lg">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)]">
          🛡️
        </div>
        <span>CarapaceAI</span>
      </Link>

      {/* Navigation Links - Updated to true paths */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
        <Link href="/platform" className="hover:text-pink-400 transition-colors">Platform</Link>
        <Link href="/architecture" className="hover:text-pink-400 transition-colors">Architecture</Link>
        <Link href="/live" className="hover:text-pink-400 transition-colors">Live View</Link>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Login
        </Link>
        <Link href="/dashboard" className="text-sm font-medium bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]">
          Deploy Agent
        </Link>
      </div>
    </header>
  );
}