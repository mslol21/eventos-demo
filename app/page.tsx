import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { HowItWorks } from '@/components/home/HowItWorks';
import { AboutSnippet } from '@/components/home/AboutSnippet';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { HomeFaqPreview } from '@/components/home/HomeFaqPreview';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesPreview />
      <HowItWorks />
      <AboutSnippet />
      <TestimonialsSection />
      <HomeFaqPreview />
      <CtaBanner />
    </div>
  );
}
