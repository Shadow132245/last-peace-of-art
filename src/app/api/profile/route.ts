import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    logger.error({ error }, "Failed to fetch profile");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio, skills, avatar, social } = await request.json();

    const data: Record<string, unknown> = {};
    if (bio !== undefined) data.bio = bio;
    if (skills !== undefined) data.skills = skills;
    if (avatar !== undefined) data.avatar = avatar;
    if (social !== undefined) data.social = social;

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        bio: bio ?? null,
        skills: skills ?? [],
        avatar: avatar ?? null,
        social: social ?? null,
      },
    });

    if (avatar !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: avatar },
      });
    }

    logger.info({ userId: session.user.id }, "Profile updated");
    return NextResponse.json({ profile });
  } catch (error) {
    logger.error({ error }, "Failed to update profile");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
