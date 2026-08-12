import * as React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  useTheme,
  alpha,
  type SxProps,
  type Theme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EastIcon from '@mui/icons-material/East';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import logoBrown from '../../../../assets/logobrown.svg';
import developerImage from '../../../../assets/SilvanoFormalPicture.jpg';
import humanConnectionImage from '../../../../assets/anthropomorphic-robot-that-performs-regular-human-job_23-2151061705.avif';
import credImage from '../../../../assets/photo_2026-08-11_00-37-58.jpg';

const LOGO_SRC = logoBrown;
const DEVELOPER_IMAGE = developerImage;
const HUMAN_CONNECTION_IMAGE = humanConnectionImage;
const CRED_IMAGE = credImage;

const DEFAULT_DASHBOARD_ROUTE = '/app/dashboard';

const CONTENT_MAX_WIDTH = 1140;

function SectionContainer({
  children,
  sx,
  ...rest
}: React.PropsWithChildren<{ sx?: SxProps<Theme> } & Omit<React.ComponentProps<typeof Box>, 'sx'>>) {
  return (
    <Box
      {...rest}
      sx={{
        maxWidth: CONTENT_MAX_WIDTH,
        mx: 'auto',
        px: { xs: 3, sm: 4, md: 6 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function Section({
  children,
  sx,
  component = 'section',
  ...rest
}: React.PropsWithChildren<{ sx?: SxProps<Theme>; component?: React.ElementType } & Omit<React.ComponentProps<typeof Box>, 'sx' | 'component'>>) {
  return (
    <Box
      component={component}
      {...rest}
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        position: 'relative',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'inline-block',
        color: 'primary.main',
        letterSpacing: 2,
        fontWeight: 700,
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}


interface FallbackImageProps {
  src: string;
  alt: string;
  ratio?: string; // aspect-ratio, e.g. "4 / 3"
  shape?: 'rounded' | 'circle';
  size?: number; // used for circle avatars
  sx?: SxProps<Theme>;
}

function FallbackImage({ src, alt, ratio = '4 / 3', shape = 'rounded', size, sx }: FallbackImageProps) {
  const [failed, setFailed] = React.useState(false);

  const shapeSx: SxProps<Theme> =
    shape === 'circle'
      ? { borderRadius: '50%', width: size ?? 160, height: size ?? 160 }
      : { borderRadius: 3, width: '100%', aspectRatio: ratio };

  if (failed) {
    return (
      <Box
        role="img"
        aria-label={alt}
        sx={{
          ...shapeSx,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.14 : 0.08),
          border: '1px solid',
          borderColor: (t) => alpha(t.palette.primary.main, 0.2),
          color: 'primary.main',
          flexShrink: 0,
          ...sx,
        }}
      >
        {shape === 'circle' ? (
          <PersonIcon sx={{ fontSize: (size ?? 160) * 0.42, opacity: 0.6 }} />
        ) : (
          <ImageOutlinedIcon sx={{ fontSize: 40, opacity: 0.5 }} />
        )}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      sx={{
        ...shapeSx,
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
        ...sx,
      }}
    />
  );
}


function BackgroundThread() {
  const theme = useTheme();
  const stroke = theme.palette.primary.main;

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 5200"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <path
          d="M 150 0
             C 150 300, 900 300, 900 650
             C 900 1000, 200 1000, 200 1350
             C 200 1700, 950 1700, 950 2050
             C 950 2400, 250 2400, 250 2750
             C 250 3100, 900 3100, 900 3450
             C 900 3800, 200 3800, 200 4150
             C 200 4500, 950 4500, 950 4850
             C 950 5050, 600 5050, 600 5200"
          fill="none"
          stroke={stroke}
          strokeOpacity={theme.palette.mode === 'dark' ? 0.16 : 0.1}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
}

function ThreadNode({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        flexShrink: 0,
        ...sx,
      }}
    />
  );
}

function AboutHero() {
  return (
    <Section sx={{ pt: { xs: 8, sm: 10, md: 14 }, pb: { xs: 6, sm: 8, md: 10 } }}>
      <SectionContainer
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <LogoMark />

        <Chip
          label="Built around human connection"
          size="small"
          variant="outlined"
          sx={{
            mt: 4,
            mb: 3,
            borderColor: (t) => alpha(t.palette.primary.main, 0.4),
            color: 'primary.main',
            fontWeight: 600,
          }}
        />

        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.02em',
            maxWidth: 760,
            fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
          }}
        >
          One thread. Real connections.
        </Typography>

        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{
            mt: 3,
            maxWidth: 640,
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.125rem' },
          }}
        >
          Unithread is a CRM built to connect businesses with the people they serve,
          bringing customer relationships, sales, communication, and team collaboration
          into one continuous thread.
        </Typography>
      </SectionContainer>
    </Section>
  );
}

function LogoMark() {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <Typography
        component="span"
        sx={{
          fontWeight: 800,
          fontSize: '1.5rem',
          letterSpacing: '-0.01em',
          color: 'text.primary',
        }}
      >
        Unithread
      </Typography>
    );
  }

  return (
    <Box
      component="img"
      src={LOGO_SRC}
      alt="Unithread logo"
      onError={() => setFailed(true)}
      sx={{ height: 40, width: 'auto', display: 'block' }}
    />
  );
}


function AboutIntro() {
  const steps = ['Lead', 'Contact', 'Deal', 'Customer'];
  const connected = [
    'conversations',
    'activities',
    'team members',
    'customer information',
    'communication',
    'business decisions',
  ];

  return (
    <Section>
      <SectionContainer>
        <Eyebrow>What is Unithread?</Eyebrow>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, maxWidth: 640 }}>
          What is Unithread?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, mb: 2 }}>
          Unithread comes from the idea of a single thread that connects everything
          together. In a CRM, that thread represents the relationship between a lead,
          a contact, a deal, and a customer, the same relationship, followed all the
          way through.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, mb: 6 }}>
          That same thread also runs through {connected.slice(0, -1).join(', ')}, and{' '}
          {connected[connected.length - 1]}. These aren't disconnected pieces of
          information sitting in separate tools. They're parts of one relationship.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 0, sm: 0 },
          }}
        >
          {steps.map((step, i) => (
            <Box
              key={step}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', sm: 'column' },
                alignItems: 'center',
                position: 'relative',
                flex: { sm: 1 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {i > 0 && (
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    position: 'absolute',
                    top: 9,
                    right: '50%',
                    width: '100%',
                    height: '2px',
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.25),
                    zIndex: 0,
                  }}
                />
              )}
              {i > 0 && (
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                    width: '2px',
                    height: 20,
                    ml: '9px',
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.25),
                  }}
                />
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' },
                  alignItems: 'center',
                  gap: { xs: 2, sm: 1.5 },
                  py: { xs: 1, sm: 0 },
                  zIndex: 1,
                  bgcolor: 'background.default',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <ThreadNode sx={{ width: 20, height: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {step}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </SectionContainer>
    </Section>
  );
}

function WhyWeBuiltIt() {
  const pillars = ['Simplicity', 'Organization', 'Visibility', 'Collaboration', 'Relationships'];

  return (
    <Section sx={{ bgcolor: (t) => alpha(t.palette.text.primary, t.palette.mode === 'dark' ? 0.03 : 0.02) }}>
      <SectionContainer>
        <Eyebrow>Why we built it</Eyebrow>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, maxWidth: 640 }}>
          Why We Built It
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, mb: 2 }}>
          We believe CRM software should help teams spend more time building
          relationships and less time managing software.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, mb: 4 }}>
          Businesses often have customer information spread across different systems,
          conversations, notes, deals, activities, and team members living in separate
          places. Unithread aims to bring these pieces together into one focused
          workspace.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {pillars.map((p) => (
            <Chip key={p} label={p} size="small" sx={{ fontWeight: 600 }} />
          ))}
        </Box>
      </SectionContainer>
    </Section>
  );
}

function HumanConnection() {
  return (
    <Section>
      <SectionContainer
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 5, md: 8 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Eyebrow>The human connection in the AI era</Eyebrow>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
            The Human Connection in the AI Era
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
            We are entering an era where artificial intelligence is becoming part of
            almost everything we do, writing emails, generating messages, summarizing
            conversations, analyzing information, answering questions, and automating
            repetitive work.
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
            As communication becomes increasingly automated, there is a risk of losing
            something businesses have always depended on: genuine human connection.
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{ fontWeight: 700, lineHeight: 1.6, borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}
          >
            A customer is not just a record in a database, an email address, or a data
            point. They are a person.
          </Typography>
        </Box>

        <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
          <FallbackImage
            src={HUMAN_CONNECTION_IMAGE}
            alt="AI Employee"
            ratio="4 / 3"
          />
        </Box>
      </SectionContainer>
    </Section>
  );
}


function AIAssistance() {
  const aiAssists = ['Automation', 'Suggestions', 'Summaries', 'Analysis', 'Drafting', 'Organization'];
  const humans = ['Understanding', 'Empathy', 'Trust', 'Decisions', 'Relationships', 'Communication'];

  return (
    <Section sx={{ bgcolor: (t) => alpha(t.palette.text.primary, t.palette.mode === 'dark' ? 0.03 : 0.02) }}>
      <SectionContainer>
        <Eyebrow>Humans, empowered by AI</Eyebrow>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, maxWidth: 720 }}>
          AI Should Assist People, Not Replace the Relationship
        </Typography>

        <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6, maxWidth: 720, mb: 4 }}>
          AI should make people better at building relationships, not remove people
          from the relationship.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, mb: 5 }}>
          Unithread will continue to introduce AI-powered features, and in time,
          AI agents. But AI exists to assist the person using it, helping write
          clearer emails, improve messages before they're sent, summarize customer
          interactions, organize information, and surface the follow-ups that matter
          most. The human remains at the center: the person using Unithread is still
          the one who understands the customer, makes the important decisions, builds
          trust, and ultimately communicates with them.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: { xs: 4, sm: 6 },
            maxWidth: 700,
          }}
        >
          <ComparisonColumn title="AI assists" items={aiAssists} />
          <ComparisonColumn title="Humans" items={humans} emphasize />
        </Box>
      </SectionContainer>
    </Section>
  );
}

function ComparisonColumn({
  title,
  items,
  emphasize = false,
}: {
  title: string;
  items: string[];
  emphasize?: boolean;
}) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: emphasize ? 'text.primary' : 'text.secondary',
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 2, borderColor: emphasize ? 'primary.main' : 'divider', opacity: emphasize ? 0.5 : 1 }} />
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {items.map((item) => (
          <Box
            component="li"
            key={item}
            sx={{
              py: 1,
              fontSize: '0.95rem',
              fontWeight: emphasize ? 600 : 400,
              color: emphasize ? 'text.primary' : 'text.secondary',
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function DeveloperMessage() {
  const message = [
    `Hello! I’m Jestony Silvano, the developer behind UniThread. I graduated from Quezon City University in June 2026 with a Bachelor of Science in Information Technology, graduating with Latin Honors (Cum Laude) and a GPA of 1.59.`,

    `My interest in building UniThread started during my internship at Aqua Smart Guard Corp., where I was first exposed to a real business system through ERPNext. I remember being fascinated by how large and interconnected it was. Seeing how software supported an actual business made me think, "What if I tried building something like this myself, but started with something smaller?" That thought eventually led me toward building a CRM.`,

    `That experience was valuable to me because it showed me that software is more than just code and features. There are real people and real businesses behind the systems we build. UniThread became a way for me to explore that idea while growing as a developer learning from mistakes, questioning my decisions, solving problems from the ground up, and trying to build something genuinely useful.`,

    `UniThread started from a simple belief: technology should help us build better relationships, not make those relationships feel less human.`,

    `As AI becomes a bigger part of how we work and communicate, I believe that matters even more. AI can help us work faster, organize information, recognize patterns, and handle repetitive tasks. But behind every customer and every conversation is still a person. I don't want UniThread to replace that person. I want it to give them better tools while keeping the relationship human.`,

    `I also want to sincerely thank Myrtle Alyn Baes, my personal QA Analyst and future QA Engineer throughout this journey. She reviewed UniThread, tested its behavior, questioned my decisions, caught details I missed, and helped me see the system from a user's perspective. Having someone willing to challenge what I built reminded me that good software isn't just about making something work, it's about making sure it works well for the people using it.`,

    `UniThread is still far from finished, and I still have a lot to learn. But I'm proud of how far this idea has come and grateful for everyone who has helped shape it. This is only the beginning, but one principle will remain at the heart of what I build: technology should make human relationships better, not replace them.`,
  ];





  return (
    <Section sx={{ bgcolor: (t) => alpha(t.palette.text.primary, t.palette.mode === 'dark' ? 0.03 : 0.02) }}>
      <SectionContainer
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 4, sm: 6 },
        }}
      >
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <FallbackImage src={DEVELOPER_IMAGE} alt="Jest, Developer and Founder of Unithread" shape="circle" size={112} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Eyebrow>A message from the developer</Eyebrow>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
            A Message From the Developer
          </Typography>

          <FormatQuoteRoundedIcon sx={{ color: 'primary.main', opacity: 0.5, fontSize: 32, mb: 1 }} aria-hidden />

          {message.map((para, i) => (
            <Typography
              key={i}
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, mb: i === message.length - 1 ? 0 : 2, fontStyle: 'italic' }}
            >
              {para}
            </Typography>
          ))}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
              <FormatQuoteRoundedIcon
                sx={{
                  color: 'primary.main',
                  opacity: 0.5,
                  fontSize: 32,
                  transform: 'rotate(180deg)',
                }}
                aria-hidden
              />
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ~ Jest, Developer &amp; Founder
          </Typography>
          {CRED_IMAGE && (
          <Box sx={{ mt: 3, width: '90%' }}>
            <FallbackImage
              src={CRED_IMAGE}
              alt="Developer's photo with his credentials"
              ratio="16 / 9"
            />
          </Box>
        )}
        </Box>
        
      </SectionContainer>
    </Section>
  );
}


function VisionSection() {
  return (
    <Section>
      <SectionContainer>
        <Eyebrow>Our vision</Eyebrow>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, maxWidth: 640 }}>
          Our Vision
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, mb: 3 }}>
           We envision a future where businesses can use advanced technology without
            sacrificing the human relationships that make those businesses successful.
            UniThread aims to help businesses connect with people, not simply treat them
            as sources of revenue.
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{ fontWeight: 700, lineHeight: 1.6, maxWidth: 640, borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}
        >
          The future of customer relationship management shouldn't be human versus
          AI. It should be humans empowered by AI.
        </Typography>
      </SectionContainer>
    </Section>
  );
}

function MissionSection() {
  return (
    <Section sx={{ bgcolor: (t) => alpha(t.palette.text.primary, t.palette.mode === 'dark' ? 0.03 : 0.02) }}>
      <SectionContainer sx={{ textAlign: 'center' }}>
        <Eyebrow>Our mission</Eyebrow>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
          Our Mission
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 640, mx: 'auto', lineHeight: 1.8, mb: 2 }}
        >
          Our goal is to build a software system that creates opportunities and
          measurable success between businesses and people, while keeping human
          connection at the center.
        </Typography>

        <Typography
          variant="h4"
          component="p"
          sx={{mt: 5,  fontWeight: 700, letterSpacing: '-0.01em', fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          One thread. Real people. Better connections.
        </Typography>
      </SectionContainer>
    </Section>
  );
}


interface AboutClosingProps {
  onExploreClick?: () => void;
  dashboardHref?: string;
}

function AboutClosing({ onExploreClick, dashboardHref }: AboutClosingProps) {
  const href = dashboardHref ?? DEFAULT_DASHBOARD_ROUTE;

  return (
    <Section sx={{ pb: { xs: 10, sm: 12, md: 16 } }}>
      <SectionContainer sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          We're Just Getting Started
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 620, mx: 'auto', lineHeight: 1.8, mb: 5 }}
        >
          Unithread is continuously evolving. We're improving the platform,
          introducing new capabilities, refining the experience, and learning from
          the people who use it. This is only the beginning.
        </Typography>

        <Button
          variant="contained"
          size="large"
          endIcon={<EastIcon />}
          href={onExploreClick ? undefined : href}
          onClick={onExploreClick}
          aria-label="Explore Unithread"
          sx={{ borderRadius: 2, px: 4, py: 1.25, fontWeight: 600 }}
        >
          Explore Unithread
        </Button>
      </SectionContainer>
    </Section>
  );
}


export interface AboutUsProps {
  onExploreClick?: () => void;
  dashboardHref?: string;
}

export default function AboutUs({ onExploreClick, dashboardHref }: AboutUsProps) {
  return (
    <Box sx={{ position: 'relative', bgcolor: 'background.default', overflow: 'hidden' }}>
      <BackgroundThread />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <AboutHero />
        <AboutIntro />
        <WhyWeBuiltIt />
        <HumanConnection />
        <AIAssistance />
        <DeveloperMessage />
        <VisionSection />
        <MissionSection />
        <AboutClosing onExploreClick={onExploreClick} dashboardHref={dashboardHref} />
      </Box>
    </Box>
  );
}