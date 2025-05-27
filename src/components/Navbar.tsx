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
      key={link.name}
    >
      <AnimatedNavLinkText text={link.name} isActive={isActive} isHovered={isLinkHoveredForTextAnim} />
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-purple-600 rounded-full -z-10" 
          layoutId="activeNavLinkPill" 
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
    </MotionLink>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  // Initialize activeSection to null. It will be set to 'home' by observer if at top.
  const [activeSection, setActiveSection] = useState<string | null>(null); 
  const [hasMounted, setHasMounted] = useState(false);
  const { setVariant } = useCursor();
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Store elements for the observer, not for general scroll handling here
  const observedElements = useRef<Map<string, HTMLElement>>(new Map());


  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    // Clear any previous observers and observed elements
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observedElements.current.clear();

    if (pathname === '/') {
      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // The last one to become intersecting (often the one most in view or entering view)
            // will set the active section.
            setActiveSection(entry.target.id);
          }
        });
        // If after checking all entries, no section is actively intersecting (e.g. scrolled between sections)
        // and scrollY is very low, default to 'home'. This handles being at the very top.
        // Otherwise, if nothing is intersecting, activeSection might remain the last one or become null.
        // For a smoother "sticky" feel, we might only change if a NEW section isIntersecting.
        // For now, this logic makes the last intersecting section active.
        const intersectingEntries = entries.filter(e => e.isIntersecting);
        if (intersectingEntries.length === 0 && window.scrollY < window.innerHeight * 0.3) {
            setActiveSection('home');
        } else if (intersectingEntries.length > 0) {
            // If multiple are intersecting, simple logic takes the last one from the callback.
            // More sophisticated logic could find the 'most' visible.
            // For now, entry.target.id from the last intersecting one is fine.
        }
      };
      
      // This rootMargin means the "active zone" for a section is when its
      // top edge is above the 40% mark of the viewport AND its bottom edge
      // is below the 45% mark of the viewport from the bottom.
      // Essentially, a section is active when it's occupying the middle ~15% of the screen,
      // or more precisely, when it's significantly in view around the center.
      // Threshold 0.1 means at least 10% of the section needs to be in this zone.
      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: '-40% 0px -40% 0px', // Activates when section is more centered
        threshold: 0.01, // Small threshold, any part in the rootMargin zone
      });
      observerRef.current = observer;

      navLinks.forEach(link => {
        if (link.sectionId) { 
          const element = document.getElementById(link.sectionId);
          if (element) {
            observedElements.current.set(link.sectionId, element);
            observer.observe(element);
          }
        }
      });
      
      // Initial check to set active section on load for homepage
      if (window.scrollY < window.innerHeight * 0.3) {
          setActiveSection('home');
      } else {
          // Manually trigger a check for other sections if not at top
          // This is a bit of a hack; ideally observer handles this.
          // We can rely on the observer to set the initial active section.
          // Let's remove complex manual scroll for now and rely on observer.
          let foundActive = false;
          navLinks.forEach(link => {
              if(link.sectionId) {
                  const el = document.getElementById(link.sectionId);
                  if (el) {
                      const rect = el.getBoundingClientRect();
                      if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4) {
                          setActiveSection(link.sectionId);
                          foundActive = true;
                      }
                  }
              }
          });
          if(!foundActive && window.scrollY > window.innerHeight * 0.3) setActiveSection(null); // Default if nothing found mid-page
      }


      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    } else {
      // If not on homepage, clear scroll-based activeSection
      setActiveSection(null); 
      if (observerRef.current) { // Ensure cleanup if observer was set
        observerRef.current.disconnect();
      }
    }
  }, [pathname, hasMounted]); 

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <NextLink 
          href={pathname === '/' ? '/#home' : '/'}
          onClick={() => {
            if (pathname === '/') {
              setActiveSection('home');
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
            let isActive = false;
            if (pathname === '/') {
                // Prioritize 'home' if activeSection is null (usually on initial load at top)
                // or if explicitly set to 'home'.
                isActive = (activeSection === null && link.sectionId === 'home' && hasMounted && (typeof window !== 'undefined' && window.scrollY < 50)) 
                           || activeSection === link.sectionId;
            } else {
              isActive = (pathname === link.href || pathname.startsWith(link.href + '/'));
              // Special case for resume page to ensure its tab highlights correctly
              if (link.sectionId === 'resume' && pathname === '/resume') isActive = true;
            }

            return (
              <TiltableNavLink
                key={link.name} 
                link={link}
                isActive={isActive}
                pathname={pathname}
                onClick={() => {
                  if (pathname === '/') {
                    setActiveSection(link.sectionId);
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