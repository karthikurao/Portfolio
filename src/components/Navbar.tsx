'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AnimatedText from './AnimatedText'
import AnimatedNavLinkText from './AnimatedNavLinkText';
import KRLogo from './Logo';
import { useEffect, useState, useRef, FC, MouseEventHandler } from 'react'
import { useCursor } from '@/context/CursorContext';

interface NavLinkItem {
  name: string;
  href: string;
  sectionId: string;
}

const navLinks: NavLinkItem[] = [
  { name: 'Home', href: '/', sectionId: 'home' },
  { name: 'About', href: '/about', sectionId: 'about' },
  { name: 'Projects', href: '/projects', sectionId: 'projects' },
  { name: 'Skills', href: '/skills', sectionId: 'skills' },
  { name: 'Resume', href: '/resume', sectionId: 'resume' }, 
  { name: 'Contact', href: '/contact', sectionId: 'contact' },
];

interface TiltableNavLinkProps {
  link: NavLinkItem;
  isActive: boolean;
  pathname: string;
  onClick: () => void;
}

const TiltableNavLink: FC<TiltableNavLinkProps> = ({ link, isActive, pathname, onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isLinkHoveredForTextAnim, setIsLinkHoveredForTextAnim] = useState(false);
  const { setVariant } = useCursor();

  const springConfig = { stiffness: 200, damping: 25, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeaveForTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const MotionLink = motion(NextLink);

  return (
    <MotionLink
      href={pathname === '/' ? `/#${link.sectionId}` : link.href}
      onClick={onClick}
      className={cn(
        'text-sm font-medium relative px-3 py-2 rounded-full group transition-colors duration-200 block',
      )}
      aria-current={isActive ? "page" : undefined}
      style={{ 
        rotateX, 
        rotateY, 
        transformPerspective: '800px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseLeaveForTilt();         
        setVariant('default');             
        setIsLinkHoveredForTextAnim(false); 
      }}
      onMouseEnter={() => {               
        setVariant('link-hover');
        setIsLinkHoveredForTextAnim(true);
      }}
    >
      <AnimatedNavLinkText text={link.name} isActive={isActive} isHovered={isLinkHoveredForTextAnim} /> 
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-purple-600 rounded-full -z-10" 
          layoutId="activeNavLinkPill" 
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />
      )}
    </MotionLink>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null); 
  const [hasMounted, setHasMounted] = useState(false);
  const { setVariant } = useCursor();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastActiveSectionRef = useRef<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to set initial active section based on path or scroll on mount
  useEffect(() => {
    if (!hasMounted) return;

    let initialId: string | null = null;
    if (pathname === '/') {
      initialId = 'home'; 
      if (typeof window !== 'undefined' && window.scrollY > 50) {
        let mostVisibleSectionId: string | null = null;
        let minTopAmongVisible = Infinity;

        navLinks.forEach(link => {
          if (link.sectionId) {
            const element = document.getElementById(link.sectionId);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Check if element is at least partially in viewport
              if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (rect.top < minTopAmongVisible) {
                  minTopAmongVisible = rect.top;
                  mostVisibleSectionId = link.sectionId;
                }
              }
            }
          }
        });
        if (mostVisibleSectionId) initialId = mostVisibleSectionId;
      }
    } else {
      for (const link of navLinks) {
        if (pathname === link.href || pathname.startsWith(link.href + '/')) {
          initialId = link.sectionId;
          break;
        }
      }
    }
    
    if (initialId !== lastActiveSectionRef.current) {
        setActiveSection(initialId);
        lastActiveSectionRef.current = initialId;
    }

  }, [pathname, hasMounted]);


  // IntersectionObserver for homepage scroll spy
  useEffect(() => {
    if (!hasMounted || pathname !== '/') {
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let newActiveCandidateId: string | null = null;

      const intersectingEntries = entries.filter(entry => entry.isIntersecting);

      if (intersectingEntries.length > 0) {
        // Sort by vertical position on screen (highest one first)
        intersectingEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        // The highest one on the screen that is intersecting (even partially) within the rootMargin
        // is considered our prime candidate.
        newActiveCandidateId = intersectingEntries[0].target.id;
      } else {
        // No section is currently intersecting the defined "active zone".
        // Fallback to 'home' only if scrolled to the very top.
        if (typeof window !== 'undefined' && window.scrollY < 50) { // 50px threshold
          newActiveCandidateId = 'home';
        } else {
          // If not at the top and nothing is intersecting, allow pill to disappear
          newActiveCandidateId = null; 
        }
      }
      
      if (newActiveCandidateId !== lastActiveSectionRef.current) {
        setActiveSection(newActiveCandidateId);
        lastActiveSectionRef.current = newActiveCandidateId;
      }
    };
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(observerCallback, {
      // This rootMargin means the "active zone" for a section to be considered is
      // when it's within the top 60% to bottom 60% of the viewport.
      // Essentially, a section is active if it's roughly in the middle.
      // Adjust -X% (top) and -Y% (bottom) to define your "trigger zone".
      // e.g., "-40% 0px -40%" makes the middle 20% the active zone.
      // Let's try a zone that's a bit more generous: top 30% to bottom 30% (middle 40%)
      rootMargin: "-30% 0px -30% 0px", 
      threshold: 0.01, // Trigger if even a tiny part (1%) of the element enters/leaves the rootMargin zone.
    });

    const currentObserver = observerRef.current;
    navLinks.forEach(link => {
      if (link.sectionId) {
        const element = document.getElementById(link.sectionId);
        if (element) {
          currentObserver.observe(element);
        }
      }
    });

    return () => {
      if (currentObserver) currentObserver.disconnect();
    };
  }, [pathname, hasMounted]);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <NextLink 
          href={pathname === '/' ? '/#home' : '/'}
          onClick={() => {
            if (pathname === '/') {
              setActiveSection('home'); 
              lastActiveSectionRef.current = 'home';
            }
          }}
          className="flex items-center group"
          aria-label="Homepage"
          onMouseEnter={() => setVariant('link-hover')} 
          onMouseLeave={() => setVariant('default')}   
        >
          <KRLogo className="text-white group-hover:text-purple-400 transition-colors duration-300" size={28} />
          <AnimatedText 
            text="Karthik U Rao" 
            className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 ml-2" 
          />
        </NextLink>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <TiltableNavLink
                key={link.name} 
                link={link}
                isActive={isActive}
                pathname={pathname}
                onClick={() => {
                  if (pathname === '/') {
                    setActiveSection(link.sectionId);
                    lastActiveSectionRef.current = link.sectionId;
                  }
                }}
              />
            )
          })}
        </div>
      </div>
    </nav>
  );
}