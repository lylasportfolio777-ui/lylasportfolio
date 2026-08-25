import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 | Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#1C1D20] flex items-center justify-center overflow-hidden">
      {/* Background Image with Heavy Blur/Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/duk94ehtq/image/upload/v1761547568/samples/people/kitchen-bar.jpg"
          alt="404 Background"
          fill
          className="object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-[#1C1D20]/80 backdrop-blur-md" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Massive ghost text behind */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-light leading-none tracking-tighter text-white/5 select-none pointer-events-none">
          404
        </span>
        
        <div className="relative z-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 uppercase tracking-widest">
            Lost in the <span className="italic text-gray-400">Lens.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto mb-12 font-light leading-relaxed">
            The frame you are looking for has been moved, deleted, or never existed. Let&apos;s get you back in focus.
          </p>
          <Link href="/">
            <button className="px-10 py-5 bg-white text-[#1C1D20] rounded-full uppercase tracking-[0.2em] text-xs font-mono hover:scale-105 active:scale-95 transition-transform duration-300">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
