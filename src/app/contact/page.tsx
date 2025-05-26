import ContactSection from '@/components/ContactSection';

// This is the component for the dedicated "/contact" route.
// It simply imports and displays our existing ContactSection component.
export default function ContactPage() {
  return (
    // We add some padding-top to give space below the sticky navbar
    <div className="pt-16">
      <ContactSection />
    </div>
  );
}