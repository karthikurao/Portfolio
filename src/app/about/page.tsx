import AboutSection from '@/components/AboutSection';

// This is the component for the dedicated "/about" route.
// It simply imports and displays our existing AboutSection component.
export default function AboutPage() {
  return (
    // We add some padding-top to give space below the sticky navbar
    <div className="pt-16">
      <AboutSection />
    </div>
  );
}