"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Link2, Globe } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  color: string;
  pillars: string;
  photo?: string;
  linkedin?: string;
  website?: string;
}

interface TeamCarouselProps {
  members: TeamMember[];
  autoplayDelay?: number;
}

export const TeamCarousel: React.FC<TeamCarouselProps> = ({
  members,
  autoplayDelay = 3500,
}) => {
  return (
    <section className="w-full">
      <style>{`
        .team-swiper {
          width: 100%;
          padding: 8px 0 56px;
        }
        .team-swiper .swiper-slide {
          width: 320px;
          height: auto;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .team-swiper .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.45;
        }
        .team-swiper .swiper-slide-active {
          opacity: 1;
        }
        .team-swiper .swiper-pagination {
          bottom: 8px !important;
        }
        .team-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: var(--color-foreground);
          opacity: 0.2;
          transition: all 0.3s ease;
        }
        .team-swiper .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 4px;
          opacity: 1;
        }
        .team-swiper .swiper-button-prev,
        .team-swiper .swiper-button-next {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          color: var(--color-foreground);
          transition: all 0.2s ease;
        }
        .team-swiper .swiper-button-prev:hover,
        .team-swiper .swiper-button-next:hover {
          background: var(--color-muted);
          transform: scale(1.05);
        }
        .team-swiper .swiper-button-prev::after,
        .team-swiper .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }
        .team-swiper .swiper-3d .swiper-slide-shadow-left,
        .team-swiper .swiper-3d .swiper-slide-shadow-right {
          background-image: none;
        }
      `}</style>

      <Swiper
        className="team-swiper"
        spaceBetween={32}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={members.length > 3}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 120,
          modifier: 2,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {members.map((person) => (
          <SwiperSlide key={person.name}>
            <article
              className="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-muted/40 border border-border transition-all duration-500 hover:border-foreground/20 hover:bg-muted/60"
              style={{
                boxShadow: `0 1px 2px rgba(0,0,0,0.04), 0 24px 60px -28px ${person.color}45`,
              }}
            >
              {/* Photo / avatar */}
              <div
                className="relative aspect-[4/5] w-full overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${person.color}18 0%, ${person.color}05 60%, transparent 100%)`,
                }}
              >
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-[88px] font-bold tracking-tight leading-none select-none"
                      style={{ color: person.color, opacity: 0.85 }}
                    >
                      {person.avatar}
                    </span>
                  </div>
                )}

                {/* Gradient overlay for legibility on photo */}
                {person.photo && (
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                )}

                {/* Name overlay (only when photo) */}
                {person.photo && (
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-xl font-bold text-white leading-tight tracking-tight">
                      {person.name}
                    </h3>
                    <p
                      className="mt-1 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{ color: person.color }}
                    >
                      {person.role}
                    </p>
                  </div>
                )}

                {/* Color accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: person.color }}
                />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                {!person.photo && (
                  <>
                    <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight">
                      {person.name}
                    </h3>
                    <p
                      className="mt-1 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{ color: person.color }}
                    >
                      {person.role}
                    </p>
                  </>
                )}

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {person.bio}
                </p>

                <div className="mt-5 pt-5 border-t border-border/60">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                    Pilares
                  </p>
                  <p
                    className="mt-1.5 text-xs font-semibold leading-snug"
                    style={{ color: person.color }}
                  >
                    {person.pillars}
                  </p>
                </div>

                {(person.linkedin || person.website) && (
                  <div className="mt-5 flex items-center gap-3">
                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${person.name}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                      >
                        <Link2 size={15} />
                      </a>
                    )}
                    {person.website && (
                      <a
                        href={person.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Website de ${person.name}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                      >
                        <Globe size={15} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
