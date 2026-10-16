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
                  hero_badge: siteContent?.hero_badge || section.badge,
                  hero_title: siteContent?.hero_title || section.title,
                  hero_subtitle: siteContent?.hero_subtitle || section.subtitle,
                  hero_bg_image: siteContent?.hero_bg_image || section.bgImageUrl,
                  hero_primary_cta_text: siteContent?.hero_primary_cta_text || section.primaryCta?.label,
                  hero_primary_cta_link: siteContent?.hero_primary_cta_link || section.primaryCta?.link,
                  hero_secondary_cta_text: siteContent?.hero_secondary_cta_text || section.secondaryCta?.label,
                  hero_secondary_cta_link: siteContent?.hero_secondary_cta_link || section.secondaryCta?.link,
                  hero_floating_badge: siteContent?.hero_floating_badge || section.floatingBadge,
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
                  kerala_badge: siteContent?.kerala_badge || section.badge,
                  kerala_title: siteContent?.kerala_title || section.title,
                  kerala_subtitle: siteContent?.kerala_subtitle || section.subtitle,
                  kerala_image: siteContent?.kerala_image || section.featureImageUrl,
                }}
                packages={packages}
              />
            );

          case 'transportationSection':
            return (
              <HomeTransportationServices
                key={key}
                content={{
                  ...siteContent,
                  home_transport_title: siteContent?.home_transport_title || section.title,
                  home_transport_subtitle: siteContent?.home_transport_subtitle || section.subtitle,
                  home_transport_cta_text: siteContent?.home_transport_cta_text || section.ctaText,
                }}
              />
            );

          case 'whyChooseUsSection':
            return (
              <WhyTripConnect
                key={key}
                content={{
                  ...siteContent,
                  why_badge: siteContent?.why_badge || section.badge,
                  why_title: siteContent?.why_title || section.title,
                  why_subtitle: siteContent?.why_subtitle || section.subtitle,
                  why_image: siteContent?.why_image || section.imageUrl,
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
