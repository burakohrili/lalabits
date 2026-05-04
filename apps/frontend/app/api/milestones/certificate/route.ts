import { NextRequest, NextResponse } from 'next/server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createElement } from 'react';

const fontRegular = readFileSync(join(process.cwd(), 'public/fonts/Inter-Regular.woff'));
const fontBold = readFileSync(join(process.cwd(), 'public/fonts/Inter-Bold.woff'));

interface CertificatePayload {
  displayName: string;
  milestoneTitle: string;
  palette: {
    bg: string;
    accent: string;
    text: string;
  };
  earnedAt: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get('x-internal-secret');
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: CertificatePayload;
  try {
    payload = (await req.json()) as CertificatePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { displayName, milestoneTitle, palette, earnedAt } = payload;
  const date = new Date(earnedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const el = createElement(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.bg,
        padding: '60px',
        fontFamily: 'Inter',
        position: 'relative' as const,
      },
    },
    // Border decoration
    createElement('div', {
      style: {
        position: 'absolute' as const,
        top: '16px',
        right: '16px',
        bottom: '16px',
        left: '16px',
        border: `3px solid ${palette.accent}`,
        borderRadius: '16px',
        opacity: 0.3,
      },
    }),
    // Badge icon circle
    createElement(
      'div',
      {
        style: {
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: palette.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          fontSize: '48px',
        },
      },
      '🏅',
    ),
    // Platform name
    createElement(
      'p',
      {
        style: {
          fontSize: '18px',
          color: palette.text,
          opacity: 0.6,
          margin: '0 0 16px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
        },
      },
      'lalabits.art',
    ),
    // Milestone title
    createElement(
      'h1',
      {
        style: {
          fontSize: '56px',
          fontWeight: 700,
          color: palette.text,
          margin: '0 0 24px',
          textAlign: 'center' as const,
          lineHeight: 1.1,
        },
      },
      milestoneTitle,
    ),
    // Creator name
    createElement(
      'p',
      {
        style: {
          fontSize: '28px',
          color: palette.accent,
          fontWeight: 600,
          margin: '0 0 8px',
        },
      },
      displayName,
    ),
    // Date
    createElement(
      'p',
      {
        style: {
          fontSize: '16px',
          color: palette.text,
          opacity: 0.5,
          margin: '0',
        },
      },
      date,
    ),
    // Bottom accent bar
    createElement('div', {
      style: {
        position: 'absolute' as const,
        bottom: '40px',
        width: '120px',
        height: '4px',
        backgroundColor: palette.accent,
        borderRadius: '2px',
      },
    }),
  );

  const svg = await satori(el, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngBuffer = resvg.render().asPng();
  const base64 = Buffer.from(pngBuffer).toString('base64');

  return NextResponse.json({ base64 });
}
