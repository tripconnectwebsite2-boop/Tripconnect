"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { APPLE_EASE } from "@/lib/animation";

export default function Destinations() {
  const keralaDestinations = [
    {
      name: "Munnar",
      slug: "munnar",
      desc: "Tea highlands & mist",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCS6rdtUJavTVgWbUI86Y5txQAw4vh9DOVSjEb-mm1UlIP_fYNmW9Mymw_Pa3SO436DDorhrW6n9uzu_yyzjmlMig0UtMIERGMaq3nXh07gg_fyXi0tz6dvO8LBDHoMv7UyEBEtZrpOeeFwbE80wqUyLa9-CDbMbCvFde6Gl8oXLj9NaUxy_UNCEb-cYrTtCWKA-J76wKU4H6tx3rK4j59d8L-cJlqFAn1cmfQ-0eHRot1evVrGgRpkgQ",
    },
    {
      name: "Alleppey",
      slug: "alleppey",
      desc: "Canals & luxury houseboats",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYPNVnb3b2brXIdXvZD39zc2boe9fKbfbQnD6l4sw-goG_3lHiykczKP8zXm6rxWmeYvsEST4E7XauXRjMEWcQagDpOglgaQ4upuyWu3EtuRA9AHXBsxLP9U1Lbg8fHUmrStCwiBreGfkiHI_KSrJbIYzGM9nTf1we1h-2hXTqggQ4nGYNxNT6LzRn-erjXKXY6g05G76ouClXiR9EfTHqETfJYmv1AR7iwuCH6ZplzAjKhpUhvemQqA",
    },
    {
      name: "Thekkady",
      slug: "thekkady",
      desc: "Periyar wilderness & spice",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB7DrmMZS3SiQWd7DM5OlxSlG62H5Ly1jkI-ybf5glHieyP0d_9EnZydFuRW8W7c9k3g3WQirq8p5hC2O6DKry-yM7ptY1xL2XMLvChQuFj65ESFiTCFw__XaOJJq9V1uWQVmQadvawd-duffdPSoD3Rnk5_oweRSG7Edif5lg93WrKv-05NTGkaMnSQO_hMQWNf2Gj_rW5Azm6QPYtPl2UONOkFnUcAutprqxol4MjUKb-PfIeYOasyA",
    },
    {
      name: "Kochi",
      slug: "kochi",
      desc: "Colonial ports & culture",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAlVyFqTk4aNYtEkC_r_Yda04E4nChyzI7VeNSSO-HHZQylo0VUKk5NePn3VeMJvjJhYF6fpc7w4SmT8lAJxRRJ4U4G6fZyRB0HQLCAWqgonYlW7WgSWnvPOUQSGY2wJ7kJ5Q8yNwCa-GXPFVjRhzYexf1k70s4xKuBjiXRV1DWxnH7tg4VfiNMnYyGicrA6jfSZs2FXEbaz9Idtg8FS6boR7YbYQzRk8JsGBJap_FOevzJrZgNfCIYWA",
    },
    {
      name: "Wayanad",
      slug: "wayanad",
      desc: "Forest trails & treehouses",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC3B2V2_xpkgSF_lsS9X3teq65onGeNyK-j97Tu7IveB9p8hvS9mGwzgujju2wpe-F0wIZ_yAberwzbQnZtX6KU1YD03prDxBFkQJ9-kCXz1Hei9vLvWul90e6F0GWR2Pdhu2pGk1IL_Tzx4D-EI90A9UvEfWXZlo511-oHbn7fnfZvwOx2CxUq96QXp0kSfm0Nbo6phuuJjz0BMPkW0zzic0Ax72gepYsiqxoj1gVFgIFZhPXP4_cEhA",
    },
    {
      name: "Varkala",
      slug: "varkala",
      desc: "Red cliffs & oceanic dusk",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDRdm9L0-nJwzJ5HQjYlUcQd8G5N22cFbx4pdzuttMxo5uzr6y1-MLT2WgqhMYpQYNSZ9-EAD-P-1CYqb1cG-X8V1RjwEutVuIDnxYdtJhGyK8F-kUDoh7A2K0Jktpv9JTzehIxzFEMoJ7J8MQKXsNTH1KkMCcQYSJmCDpf3rQkXkPV7wjd6hmWgsOArDd3xzY4BnlhxdfgLZJnwPz7tY1GHaOrqd7e9_jH3a-wHxf8CdFaj5FDiQx15w",
    },
  ];

  const indiaDestinations = [
    {
      name: "Rajasthan",
      tag: "Royal Palaces",
      desc: "Forts, royal courtyards, and Thar dunes.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBA2KBVA1-vto0Nr3rMkS62Kso4TxtBQv5eGBOlA0UYF8ZT89ayz2O0oPhx1Fq5YJTHZ0HB6qj-kCrc5EMQ6EPumSvWwbOVg6OJqakvSih8wWlVhJZ1-e_D0qHBhT_LRcS45-IlFhDEvmA7JsLI6IVYbMixhJPFrkBvC28Wlev9q59_OAInYf5wn_491adquAgqDN9KzKQvey7kbpQ5MhbpVC_cYF1MGEYSIdA8qymhlEBlEWIEobOgEQ",
    },
    {
      name: "Kashmir",
      tag: "Valley of Heaven",
      desc: "Dal Lake shikaras & alpine meadows.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAejrFREpWCmER6tk4lGcVwNraZ28s44uPMnI6Bjjlhzf-YClhd-wTd3tKBIMMnwC4sggWPbObzhtugJ6mTZ3teXGwR2LjohKtRJ9Vfu7mznDjk9nBwycQI9PZEexGBEoJ1plJAmDZPWvh5zmURPurHvuHeWKJJ54SdzO-TrSCOEUDbbTG4Gpns2mYtnRSfIuCF1i-Hth1KM0OO2shaTPvfOmhVrxdzgWnD6e2UXsooGJtQYxl95aR3zA",
    },
    {
      name: "Himachal",
      tag: "Cedar & Snow",
      desc: "Pine-fringed passes & mountain sanctuaries.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAncHq9IQ1qmGmThfMCHDiaMK85LI9hYUbMYJeYQfvDiysPBQcXQkqBHs9zBGAv2I3FD9BF5263yFKwx8hoTwcJ0yNTSVpUBJtbrCfDDKKLmhIQCHYP3RBB_--A9uba2ioiycLDtFEEq40EvnsRXd2DIVGJ1nSHFwbPAnX-TmB49O4utW7ADgjLGuFpOEPw_4kDtXxrIexAeyVvKC0NDHn7C7t0TTOWWXC2mo3JmszqZ0DcmsxvKSIKTQ",
    },
    {
      name: "Goa",
      tag: "Coastal Heritage",
      desc: "Secluded coves & Portuguese estates.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuApVW6XVf2yU6Di3i0Ef_x85IKmvzRMeH05946uPZrHoOB2aRH1ejFQHt8-9yktXs0bT-w7jUB0Og60IU8gycUPgp_kNAHAluP5q86miauVUCv6XWUI8cfrOEy84I0DG5koCWGTDr0o5K6K8_Jofu0TrTgcFadyanmp4gB0U9tlUJvW02dzPwsqFq2L4O8gvyr3CODp322BVGA0TcwagQTqvCAq-gK30ozFK8zkt2t1pyaULxn3OS6Wkw",
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl 2xl:max-w-[1360px] mx-auto overflow-hidden" id="destinations">
      {/* Header with Viewport Scroll Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
        className="max-w-3xl mb-12 lg:mb-16"
      >
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
          Geographic Atlas
        </span>
        <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-2 mb-3">
          Explore Destinations
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          From the tranquil spice hills of Kerala to the imperial monuments and snowbound peaks of India.
        </p>
      </motion.div>

      <div className="space-y-14 lg:space-y-16">
        {/* Kerala Sanctuary Highlights */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
              Kerala Highlights
            </h3>
            <span className="font-body-sm text-body-sm text-outline">6 Prime Escapes</span>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {keralaDestinations.map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.08,
                  ease: APPLE_EASE,
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Link
                  className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-surface-container-high flex flex-col justify-end p-4 shadow-sm hover:shadow-xl transition-all block border border-outline-variant/15 hover:border-primary/40"
                  href={`/destinations/${dest.slug}`}
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition-transform duration-600 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background/85 via-on-background/30 to-transparent" />
                  <div className="relative z-10 text-white">
                    <h4 className="font-headline-sm text-headline-sm font-semibold text-white group-hover:text-primary-fixed transition-colors">{dest.name}</h4>
                    <p className="font-body-sm text-body-sm text-surface-container-high line-clamp-1">{dest.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-2 font-label-sm text-label-sm text-primary-fixed group-hover:underline">
                      <span>Explore</span>
                      <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* India Highlights */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">public</span>
              India Highlights
            </h3>
            <span className="font-body-sm text-body-sm text-outline">Pan-India Curations</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {indiaDestinations.map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.75,
                  delay: idx * 0.12,
                  ease: APPLE_EASE,
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Link
                  className="laptop-card-hover group relative rounded-2xl overflow-hidden aspect-[16/10] bg-surface-container-high flex flex-col justify-end p-6 shadow-sm hover:shadow-2xl transition-all block border border-outline-variant/15 hover:border-primary/40"
                  href="/destinations"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition-transform duration-600 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/25 to-transparent" />
                  <div className="relative z-10 text-white">
                    <div className="px-2.5 py-1 rounded bg-surface/20 backdrop-blur-md inline-block mb-2 border border-white/10">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-surface-container-lowest font-medium">
                        {dest.tag}
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md font-semibold text-white group-hover:text-primary-fixed transition-colors">{dest.name}</h4>
                    <p className="font-body-sm text-body-sm text-surface-container-high">{dest.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
