import React from 'react';
import Hero from './Hero';
import FeaturedPackages from './FeaturedPackages';
import Destinations from './Destinations';
import KeralaTours from './KeralaTours';
import HomeTransportationServices from './HomeTransportationServices';
import WhyTripConnect from './WhyTripConnect';
import SpecialOffer from './SpecialOffer';
import Reviews from './Reviews';
import PlanTripForm from './PlanTripForm';
import { TravelPackage, Destination, SiteContent, SpecialOffer as SpecialOfferType } from '@/lib/types';

interface PageBuilderRendererProps {
  sections?: any[];
  siteContent?: Partial<SiteContent>;
  packages?: TravelPackage[];
  destinations?: Destination[];
  offer?: SpecialOfferType | null;
}

export default function PageBuilderRenderer({
  sections,
  siteContent,
  packages = [],
  destinations = [],
  offer,
}: PageBuilderRendererProps) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    // Default fallback order if no custom Page Builder sections are defined
    return (
      <>
        <Hero content={siteContent} />
        <FeaturedPackages packages={packages} />
        <Destinations destinations={destinations} />
        <KeralaTours content={siteContent} />
        <HomeTransportationServices content={siteContent} />
        <WhyTripConnect content={siteContent} />
        {offer && <SpecialOffer offer={offer} />}
        <Reviews />
        <PlanTripForm />
      </>
    );
  }

  return (
    <>
      {sections.map((section, idx) => {
        const key = section._key || `${section._type}-${idx}`;

        switch (section._type) {
          case 'heroSection':
            return (
              <Hero
                key={key}
                content={{
                  ...siteContent,
                  hero_badge: section.badge || siteContent?.hero_badge,
                  hero_title: section.title || siteContent?.hero_title,
                  hero_subtitle: section.subtitle || siteContent?.hero_subtitle,
                  hero_bg_image: section.bgImageUrl || siteContent?.hero_bg_image,
                  hero_primary_cta_text: section.primaryCta?.label || siteContent?.hero_primary_cta_text,
                  hero_primary_cta_link: section.primaryCta?.link || siteContent?.hero_primary_cta_link,
                  hero_secondary_cta_text: section.secondaryCta?.label || siteContent?.hero_secondary_cta_text,
                  hero_secondary_cta_link: section.secondaryCta?.link || siteContent?.hero_secondary_cta_link,
                  hero_floating_badge: section.floatingBadge || siteContent?.hero_floating_badge,
                }}
              />
            );

          case 'featuredPackagesSection': {
            const displayPackages = section.manualPackages?.length
              ? section.manualPackages
              : packages.slice(0, section.maxItems || 6);
            return <FeaturedPackages key={key} packages={displayPackages} />;
          }

          case 'destinationsSection': {
            const displayDestinations = section.manualDestinations?.length
              ? section.manualDestinations
              : destinations;
            return <Destinations key={key} destinations={displayDestinations} />;
          }

          case 'keralaToursSection':
            return (
              <KeralaTours
                key={key}
                content={{
                  ...siteContent,
                  kerala_badge: section.badge || siteContent?.kerala_badge,
                  kerala_title: section.title || siteContent?.kerala_title,
                  kerala_subtitle: section.subtitle || siteContent?.kerala_subtitle,
                  kerala_image: section.featureImageUrl || siteContent?.kerala_image,
                }}
              />
            );

          case 'transportationSection':
            return (
              <HomeTransportationServices
                key={key}
                content={{
                  ...siteContent,
                  home_transport_title: section.title || siteContent?.home_transport_title,
                  home_transport_subtitle: section.subtitle || siteContent?.home_transport_subtitle,
                  home_transport_cta_text: section.ctaText || siteContent?.home_transport_cta_text,
                }}
              />
            );

          case 'whyChooseUsSection':
            return (
              <WhyTripConnect
                key={key}
                content={{
                  ...siteContent,
                  why_badge: section.badge || siteContent?.why_badge,
                  why_title: section.title || siteContent?.why_title,
                  why_subtitle: section.subtitle || siteContent?.why_subtitle,
                  why_image: section.imageUrl || siteContent?.why_image,
                }}
              />
            );

          case 'specialOffersSection':
            return offer ? <SpecialOffer key={key} offer={offer} /> : null;

          case 'reviewsSection':
            return <Reviews key={key} />;

          case 'callToActionSection':
            return <PlanTripForm key={key} />;

          case 'richTextSection':
            return (
              <section key={key} className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
                {section.sectionTitle && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-6">
                    {section.sectionTitle}
                  </h2>
                )}
                {/* Fallback rich text container */}
                <div className="prose dark:prose-invert max-w-none text-on-surface-variant leading-relaxed">
                  {typeof section.content === 'string' ? (
                    <p>{section.content}</p>
                  ) : (
                    <div className="space-y-4">
                      {Array.isArray(section.content) &&
                        section.content.map((block: any, bi: number) => (
                          <p key={bi}>
                            {block.children?.map((c: any) => c.text).join('') || ''}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
