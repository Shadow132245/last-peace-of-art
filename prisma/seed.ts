import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const uid = () => crypto.randomUUID();

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

async function main() {
  // Create the sample user
  const userId = uid();

  const avatarUrl = "https://api.dicebear.com/9.x/notionists/svg?seed=Omar";

  const user = await prisma.user.upsert({
    where: { name: "Omar" },
    update: { image: avatarUrl },
    create: {
      id: userId,
      name: "Omar",
      email: "omar@example.com",
      emailVerified: true,
      image: avatarUrl,
      role: "user",
      createdAt: new Date("2026-03-01"),
    },
  });

  console.log("User created: " + user.name + " (" + user.id + ")");

  // Create profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      avatar: avatarUrl,
    },
    create: {
      id: uid(),
      userId: user.id,
      bio: "Full-stack developer & content creator. I write about Node.js, Discord bots, automation, and build tools. I also produce music and game in my free time.",
      avatar: avatarUrl,
      skills: ["Node.js", "TypeScript", "Discord.js", "React", "PostgreSQL", "Docker", "Audio Engineering"],
      social: { banner: "https://api.dicebear.com/9.x/notionists/svg?seed=banner", avatarSize: 80, bannerHeight: 192 },
    },
  });

  console.log("Profile created");

  // Create Projects
  const projects = [
    {
      title: "Advanced Discord Moderation Bot",
      description: "A feature-rich moderation bot built with Discord.js v14, featuring automated moderation, custom commands, logging, and a web dashboard.",
      content: "A production-ready Discord moderation bot built in TypeScript using Discord.js v14. Features include moderation (kick, ban, mute, warn), auto-moderation, reaction roles, ticket system, and web dashboard. Uses PostgreSQL via Prisma and Docker deployment.",
      tags: ["nodejs", "discord", "typescript", "bots"],
    },
    {
      title: "SWAT 4 Server Setup Guide",
      description: "A comprehensive guide to setting up a SWAT 4 server on VPS with performance optimization, mods, and configuration tuning.",
      content: "SWAT 4 server setup guide covering VPS requirements, SteamCMD installation, Server.ini configuration, mods like SWAT 4 Expansion, performance tuning with TickerInterval and MaxClientRate, and voice chat optimization.",
      tags: ["gaming", "swat4", "servers", "arabic"],
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({
      data: {
        id: uid(),
        userId: user.id,
        title: proj.title,
        description: proj.description,
        content: proj.content,
        tags: proj.tags,
        published: true,
        views: Math.floor(Math.random() * 300),
        likesCount: Math.floor(Math.random() * 40),
        dislikesCount: Math.floor(Math.random() * 5),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 86400000)),
      },
    });
  }

  console.log(projects.length + " projects created");

  // Create Blog Posts
  const posts = [
    {
      titleEn: "Building a Discord Bot Dashboard with Express and Prisma",
      slug: "discord-bot-dashboard-express-prisma",
      contentEn: "A complete guide to building a web dashboard for your Discord bot using Express.js, TypeScript, Prisma ORM, and Discord OAuth2. Covers schema design, Express setup, OAuth2 login flow, and real-time updates with SSE.",
      excerptEn: "A complete guide to building a web dashboard for your Discord bot using Express.js, TypeScript, Prisma ORM, and Discord OAuth2.",
      tagsEn: ["nodejs", "discord", "dashboard", "express", "prisma"],
    },
    {
      titleEn: "Behind The Scenes: How The Last Peace of Art Handles Uploads",
      slug: "behind-the-scenes-file-uploads",
      contentEn: "A deep dive into how The Last Peace of Art solves the Vercel ephemeral filesystem problem with a three-tier upload strategy: Vercel Blob for production, Data URI in PostgreSQL as fallback, and local filesystem for development.",
      excerptEn: "A deep dive into how The Last Peace of Art solves the Vercel ephemeral filesystem problem with a three-tier upload strategy.",
      tagsEn: ["vercel", "uploads", "architecture", "typescript", "behind-the-scenes"],
    },
    {
      titleAr: "How to Build a Complex System with TypeScript from Scratch",
      slug: "build-complex-system-typescript",
      contentAr: "A detailed guide on building production-grade TypeScript systems using Repository Pattern, Service Layer, and unified Error Handling. Covers clean architecture principles for scalable applications.",
      excerptAr: "A comprehensive guide on building scalable TypeScript systems with Repository Pattern, Service Layer, and Error Handling.",
      tagsAr: ["typescript", "architecture", "programming", "arabic"],
    },
    {
      titleAr: "Audio Engineering for Beginners: Auto-Tune for Rap and Trap",
      slug: "audio-engineering-auto-tune-rap",
      contentAr: "A beginner-friendly guide to audio engineering covering Auto-Tune setup for rap and trap vocals. Includes DAW setup, VST plugins, recording tips, EQ, compression, and reverb techniques with free plugin recommendations.",
      excerptAr: "A step-by-step guide to setting up Auto-Tune for rap and trap music production, from recording to mixing.",
      tagsAr: ["music", "audio", "production", "tutorial", "arabic"],
    },
  ];

  for (const post of posts) {
    const content = post.contentEn || post.contentAr || "";
    const excerpt = post.excerptEn || post.excerptAr || "";
    const tags = post.tagsEn || post.tagsAr || [];
    const title = post.titleEn || post.titleAr || "";

    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log("  Skipping existing post: " + post.slug);
      continue;
    }

    await prisma.post.create({
      data: {
        id: uid(),
        userId: user.id,
        title,
        slug: post.slug,
        content,
        excerpt: excerpt || null,
        tags,
        published: true,
        views: Math.floor(Math.random() * 500),
        likesCount: Math.floor(Math.random() * 60),
        dislikesCount: Math.floor(Math.random() * 3),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 86400000)),
      },
    });

    console.log("  Post created: " + post.slug);
  }

  console.log(posts.length + " posts created");

  // Create Forum Threads
  const threads = [
    {
      title: "eFootball 2026 — Best Tactics and Formations",
      content: "Hey everyone, what's your go-to formation in eFootball 2026? I've been trying 4-3-3 with LBC for counter-attacks, 4-2-2-2 with Possession for ball control, and 3-5-2 with Quick Counter. Busquets as DMF is incredible. What are you using?",
      tags: ["gaming", "efootball", "pes"],
    },
    {
      title: "Free VST Plugins Collection for Music Production",
      content: "A curated list of free VST plugins for music producers: TDR Nova (dynamic EQ), Kotelnikov (compressor), Vital (wavetable synth), Surge XT (open-source synth), Valhalla Supermassive (reverb/delay), and Fresh Air (vocal exciter).",
      tags: ["music", "production", "vst", "plugins"],
    },
    {
      title: "Getting Started with Discord Bot Development in Node.js",
      content: "A beginner's guide to Discord bot development: learn JavaScript/TypeScript basics, set up Discord.js, create your first ping command, and build slash commands. Perfect for Arabic-speaking developers starting out.",
      tags: ["discord", "bots", "nodejs", "tutorial", "arabic"],
    },
    {
      title: "Solving Vercel Upload Issues — The Definitive Fix",
      content: "Many developers face file upload issues on Vercel due to its ephemeral filesystem. The solution: use external storage like Vercel Blob or AWS S3, or convert images to base64 and store directly in PostgreSQL. Project link: https://lastpeace.vercel.app",
      tags: ["vercel", "uploads", "webdev", "tutorial", "arabic"],
    },
    {
      title: "Best PC Builds for Music Production and Gaming 2026",
      content: "PC build recommendations for music production and gaming in 2026. Budget build ($800): Ryzen 5 7600, 32GB DDR5. Mid-range ($1500): Ryzen 7 7800X3D, 64GB DDR5, RTX 4070. Pro ($3000+): Ryzen 9 7950X, 128GB DDR5, RTX 5090. Key tip: prioritize CPU single-core performance for music production.",
      tags: ["gaming", "production", "pc-build", "hardware"],
    },
  ];

  for (const thread of threads) {
    await prisma.thread.create({
      data: {
        id: uid(),
        userId: user.id,
        title: thread.title,
        content: thread.content,
        tags: thread.tags,
        published: true,
        views: Math.floor(Math.random() * 200),
        likesCount: Math.floor(Math.random() * 30),
        dislikesCount: Math.floor(Math.random() * 5),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 60 * 86400000)),
      },
    });

    console.log("  Thread created: " + thread.title.slice(0, 40) + "...");
  }

  console.log(threads.length + " threads created");
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
