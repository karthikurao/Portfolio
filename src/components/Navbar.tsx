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
import { Menu, X } from 'lucide-react';

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

  const springConfig = { stiffness: 150, damping: 35, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeaveForTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
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
      <NextLink
        href={pathname === '/' ? `/#${link.sectionId}` : link.href}
        onClick={onClick}
        className={cn(
          'text-sm font-medium relative px-3 py-2 rounded-full group transition-colors duration-200 block',
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <AnimatedNavLinkText text={link.name} isActive={isActive} isHovered={isLinkHoveredForTextAnim} /> 
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-purple-600 rounded-full -z-10" 
            layoutId="activeNavLinkPill" 
            transition={{ 
              type: 'spring', 
              stiffness: 350, 
              damping: 30,
              mass: 0.8,
              restDelta: 0.001
            }}
          />
        )}
      </NextLink>
    </motion.div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null); 
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const { setVariant } = useCursor();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastActiveSectionRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Get all currently intersecting sections
      const intersectingSections = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => ({
          id: entry.target.id,
          top: entry.boundingClientRect.top,
          ratio: entry.intersectionRatio
        }));

      if (intersectingSections.length > 0) {
        // Sort by the section that's most visible (highest intersection ratio)
        // If ratios are similar, prefer the one closer to the top
        intersectingSections.sort((a, b) => {
          const ratioDiff = b.ratio - a.ratio;
          if (Math.abs(ratioDiff) < 0.1) {
            // If intersection ratios are very close, prefer the one closer to top
            return a.top - b.top;
          }
          return ratioDiff;
        });

        const newActiveId = intersectingSections[0].id;
        
        if (newActiveId !== lastActiveSectionRef.current) {
          setActiveSection(newActiveId);
          lastActiveSectionRef.current = newActiveId;
        }
      } else {
        // No sections intersecting - determine based on scroll position
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // If at very top, show home
        if (scrollY < 100) {
          if (lastActiveSectionRef.current !== 'home') {
            setActiveSection('home');
            lastActiveSectionRef.current = 'home';
          }
        } else {
          // Find the section that should be active based on scroll position
          let activeId: string | null = null;
          
          for (const link of navLinks) {
            if (link.sectionId) {
              const element = document.getElementById(link.sectionId);
              if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const elementBottom = elementTop + rect.height;
                
                // Check if the section is currently in the viewport area
                if (scrollY >= elementTop - windowHeight / 2 && scrollY < elementBottom - windowHeight / 2) {
                  activeId = link.sectionId;
                  break;
                }
              }
            }
          }
          
          if (activeId && activeId !== lastActiveSectionRef.current) {
            setActiveSection(activeId);
            lastActiveSectionRef.current = activeId;
          }
        }
      }
    };
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(observerCallback, {
      // Use a more generous root margin for better detection
      rootMargin: "-20% 0px -20% 0px", 
      // Multiple thresholds for better tracking
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 
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

  // Additional scroll listener for smoother updates
  useEffect(() => {
    if (!hasMounted || pathname !== '/') return;

    const handleScroll = () => {
      // Throttle scroll events
      if (scrollTimeoutRef.current) return;
      
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        let activeId: string | null = null;

        // Check each section to find which one is most visible
        for (const link of navLinks) {
          if (link.sectionId) {
            const element = document.getElementById(link.sectionId);
            if (element) {
              const rect = element.getBoundingClientRect();
              const elementTop = rect.top;
              const elementBottom = rect.bottom;
              const elementCenter = (elementTop + elementBottom) / 2;
              
              // Section is considered active if its center is in the viewport
              // or if it's taking up most of the viewport
              if (
                (elementTop <= windowHeight / 2 && elementBottom >= windowHeight / 2) ||
                (elementCenter >= 0 && elementCenter <= windowHeight)
              ) {
                activeId = link.sectionId;
                break;
              }
            }
          }
        }

        // Special case for home section at the very top
        if (scrollY < 100) {
          activeId = 'home';
        }

        if (activeId && activeId !== lastActiveSectionRef.current) {
          setActiveSection(activeId);
          lastActiveSectionRef.current = activeId;
        }

        scrollTimeoutRef.current = null;
      }, 50); // 50ms throttle for smoother updates
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
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
          onMouseEnter={() => {
            setVariant('link-hover');
            setIsLogoHovered(true);
          }} 
          onMouseLeave={() => {
            setVariant('default');
            setIsLogoHovered(false);
          }}   
        >
          <KRLogo className="text-white group-hover:text-purple-400 transition-colors duration-300" size={28} />
          <AnimatedText 
            text="Karthik U Rao" 
            className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 ml-2" 
            isHovered={isLogoHovered}
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-purple-400 transition-colors duration-200 p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            onMouseEnter={() => setVariant('link-hover')} 
            onMouseLeave={() => setVariant('default')}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <NextLink
                    key={link.name}
                    href={pathname === '/' ? `/#${link.sectionId}` : link.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (pathname === '/') {
                        setActiveSection(link.sectionId);
                        lastActiveSectionRef.current = link.sectionId;
                      }
                    }}
                    className={cn(
                      'text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200',
                      isActive 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    {link.name}
                  </NextLink>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}