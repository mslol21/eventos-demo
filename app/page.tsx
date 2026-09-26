import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { HowItWorks } from '@/components/home/HowItWorks';
import { AboutSnippet } from '@/components/home/AboutSnippet';
import { InstagramGalleryStrip } from '@/components/home/InstagramGalleryStrip';
import { HomeFaqPreview } from '@/components/home/HomeFaqPreview';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      <HeroSection />
      <ServicesPreview />
      <HowItWorks />
      <AboutSnippet />
      <InstagramGalleryStrip />
      <HomeFaqPreview />
      <CtaBanner />
    </div>
  );
}
