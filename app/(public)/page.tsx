import Link from "next/link";

import { BlogCard } from "@/components/content/blog-card";
import { PortfolioCard } from "@/components/content/portfolio-card";
import { getPublicSettings, getPublishedPortfolio, getPublishedPosts } from "@/lib/supabase/queries/public";

const impactStats = [
  { value: "12+", label: "Launch-ready products" },
  { value: "08", label: "Core training tracks" },
  { value: "24/7", label: "Digital brand presence" },
  { value: "SEO", label: "Built into publishing" },
];

const teamMembers = [
  {
    name: "Muhammad Abdullah",
    role: "Founder & Strategy Lead",
    summary: "Leads delivery, architecture, and performance-focused publishing systems.",
  },
  {
    name: "Umer Ajmal",
    role: "App Systems Specialist",
    summary: "Builds product flows that connect web experiences with practical business needs.",
  },
  {
    name: "Ali Haider",
    role: "Frontend Developer",
    summary: "Shapes interface systems with stronger visual hierarchy and clean responsive behavior.",
  },
  {
    name: "Muhammad Sami Khan",
    role: "MERN Stack Engineer",
    summary: "Supports scalable implementation, APIs, and full-stack execution for client projects.",
  },
];

const productShowcase = [
  { title: "AI Video Learning Library", time: "12:45", text: "Curated video-first explainers for practical digital execution." },
  { title: "Service Landing Systems", time: "09:30", text: "Focused landing experiences designed to convert interest into leads." },
  { title: "Custom CMS Solutions", time: "15:20", text: "Publishing infrastructure with SEO scoring, dynamic content, and admin workflows." },
  { title: "Training Programs", time: "11:15", text: "Structured learning ladders for beginner, intermediate, and expert levels." },
];

const trustBadges = ["AI-Ready Workflows", "SEO-Driven Publishing", "Portfolio Showcase", "Media URL Library", "Admin Audit Logs", "Brand Theme Control"];

const servicePillars = [
  {
    title: "Brand Websites",
    summary: "High-trust business and personal branding sites with sharper structure, faster loading, and stronger calls to action.",
  },
  {
    title: "Learning Platforms",
    summary: "Course-centric landing systems that explain tracks, outcomes, process, and enrollment flow without clutter.",
  },
  {
    title: "SEO Content Hubs",
    summary: "Blog-first experiences with metadata control, schema output, internal linking, and editorial workflows.",
  },
  {
    title: "Admin Workflows",
    summary: "Protected publishing operations with role-aware access, audit visibility, and reusable media assets.",
  },
];

const learningTracks = [
  {
    level: "Major Tracks",
    courses: ["Flutter Apps with AI", "MERN Stack with AI", "WordPress with AI", "Full Stack SEO with AI"],
  },
  {
    level: "Intermediate Tracks",
    courses: ["Graphics Designing with AI", "Video Editing with AI", "Office Management with AI"],
  },
  {
    level: "Expert Tracks",
    courses: ["Advanced AI Development", "AI Business Solutions", "AI System Architecture"],
  },
];

const trainingRules = [
  "Expert level candidates can move into free, performance-based internship workflows.",
  "Intermediate tracks start with a lighter entry fee and become performance-led after evaluation.",
  "Beginner tracks focus on fundamentals before candidates move into stronger production work.",
  "Monthly review cycles decide the next step in learning, internship eligibility, and certification path.",
];

const showcaseMetrics = [
  { title: "Homepage Sections", value: "11", detail: "Layered content blocks instead of a thin brochure page." },
  { title: "Reusable Modules", value: "6", detail: "Cards, trust strips, stats, process, testimonials, and CTA systems." },
  { title: "Theme Control", value: "2", detail: "Premium presets with admin-driven colors and typography." },
];

const processSteps = [
  {
    step: "01",
    title: "Discover",
    text: "Clarify business goals, content model, and what the public site actually needs to communicate first.",
  },
  {
    step: "02",
    title: "Design",
    text: "Shape hero, sections, typography, and visual hierarchy so the site feels intentional instead of generic.",
  },
  {
    step: "03",
    title: "Publish",
    text: "Use the CMS to add posts, pages, projects, media URLs, and SEO settings without touching code.",
  },
  {
    step: "04",
    title: "Scale",
    text: "Expand content categories, landing pages, and portfolio items while retaining one clean system.",
  },
];

const testimonials = [
  {
    name: "Training Cohort Lead",
    role: "Digital Skills Program",
    quote: "Visitors understand the offer faster when the homepage shows tracks, rules, outcomes, and a clear next step in one flow.",
  },
  {
    name: "Small Business Owner",
    role: "Service Brand",
    quote: "The right sections made the website feel more credible. It stopped looking like a demo and started looking like a real company.",
  },
  {
    name: "Content Publisher",
    role: "SEO Workflow",
    quote: "The CMS side matters, but the public structure matters more. Better sections immediately improved clarity and perceived quality.",
  },
];

const faqItems = [
  {
    question: "Can I update the homepage without editing code?",
    answer: "Core branding, colors, fonts, posts, pages, portfolio items, and media assets are already managed in the CMS. Additional homepage blocks can also be made dynamic in the next pass.",
  },
  {
    question: "Why does this feel more rigid than WordPress right now?",
    answer: "WordPress gets flexibility from a mature block ecosystem. A custom system reaches that level by deliberately adding reusable homepage blocks, theme controls, and content-driven sections.",
  },
  {
    question: "Can I reuse one image across multiple pages?",
    answer: "Yes. Save the public URL once in Media, then browse and attach it while editing posts, pages, or portfolio items.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-sm uppercase tracking-[0.22em] text-primary">{eyebrow}</p> : null}
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
        {copy ? <p className="mt-3 text-base text-muted-foreground">{copy}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default async function HomePage() {
  const [posts, portfolio, settings] = await Promise.all([
    getPublishedPosts(),
    getPublishedPortfolio(),
    getPublicSettings(),
  ]);

  return (
    <div>
      <section className="theme-hero border-bottom py-5 py-lg-6">
        <div className="container-main">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <p className="text-uppercase small tracking-[0.24em] opacity-75">Custom CMS Website</p>
              <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-6xl">
                {settings?.homepage_hero_content || "Modern portfolio and publishing platform built for speed and SEO."}
              </h1>
              <p className="mt-4 max-w-2xl fs-5 opacity-75">{settings?.site_description}</p>
              <div className="mt-4 d-flex flex-wrap gap-3">
                <Link href="/portfolio" className="btn btn-primary btn-lg px-4">
                  View Portfolio
                </Link>
                <Link href="/blog" className="btn btn-outline-light btn-lg px-4">
                  Read Blog
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="theme-surface theme-card-glow rounded-4 p-4 p-lg-5 text-foreground">
                <p className="mb-2 text-uppercase small tracking-[0.2em] text-primary">Publishing Flow</p>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">Two premium looks. One CMS.</h2>
                <p className="mt-3 text-muted-foreground">
                  Switch between advanced visual systems from the new Appearance panel, then fine-tune fonts and colors
                  without touching code.
                </p>
                <div className="mt-4 row g-3">
                  <div className="col-6">
                    <div className="rounded-4 border p-3">
                      <p className="mb-1 text-sm font-semibold">SEO Ready</p>
                      <p className="mb-0 text-xs text-muted-foreground">Metadata, schema, sitemap, and publishing score.</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="rounded-4 border p-3">
                      <p className="mb-1 text-sm font-semibold">Media URLs</p>
                      <p className="mb-0 text-xs text-muted-foreground">GitHub, Drive, Canva, and YouTube supported.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-bottom py-3">
        <div className="container-main">
          <div className="d-flex flex-wrap align-items-center gap-3 gap-lg-4">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-pill border px-3 py-2 text-xs fw-semibold text-uppercase tracking-[0.18em]"
                style={{ background: "color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-main py-5">
        <div className="row g-4">
          {impactStats.map((item) => (
            <div key={item.label} className="col-6 col-lg-3">
              <div className="theme-surface theme-card-glow h-100 rounded-4 p-4">
                <p className="mb-2 text-sm text-uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-primary">{item.value}</h2>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-main py-5">
        <div className="row align-items-center gy-4">
          <div className="col-lg-6">
            <SectionHeading
              eyebrow="Why This Feels Stronger"
              title="A wow site needs more than a hero and two grids."
              copy="The homepage now layers proof, offer clarity, process, training tracks, team, content, and contact. That is how custom work starts competing with polished WordPress builds."
            />
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {showcaseMetrics.map((metric) => (
                <div key={metric.title} className="col-md-4">
                  <div className="theme-surface theme-card-glow h-100 rounded-4 p-4">
                    <p className="mb-2 text-sm text-uppercase tracking-[0.18em] text-muted-foreground">{metric.title}</p>
                    <p className="mb-2 font-[family-name:var(--font-heading)] text-4xl fw-bold text-primary">{metric.value}</p>
                    <p className="mb-0 text-sm text-muted-foreground">{metric.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-5">
        <SectionHeading
          eyebrow="Services"
          title="The homepage now explains what the platform is actually built to do."
          copy="This block makes the offer concrete. It turns the design from a demo layout into a business-ready presentation."
        />
        <div className="row mt-2 g-4">
          {servicePillars.map((pillar, index) => (
            <div key={pillar.title} className="col-md-6 col-xl-3">
              <div className="theme-surface theme-card-glow h-100 rounded-4 p-4">
                <div className="mb-3 d-inline-flex rounded-circle border px-3 py-2 text-sm fw-semibold text-primary">{`0${index + 1}`}</div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-3 mb-0 text-sm text-muted-foreground">{pillar.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-main py-5">
        <div className="row align-items-center gy-4">
          <div className="col-lg-5">
            <SectionHeading
              eyebrow="Team"
              title="Meet the people shaping products, training, and digital growth."
              copy="This section gives the homepage more weight and credibility, similar to software house and training brand sites that present the team early."
            />
          </div>
          <div className="col-lg-7">
            <div className="row g-3">
              {teamMembers.map((member) => (
                <div key={member.name} className="col-md-6">
                  <div className="theme-surface theme-card-glow h-100 rounded-4 p-4">
                    <p className="mb-1 font-semibold">{member.name}</p>
                    <p className="mb-2 text-sm text-primary">{member.role}</p>
                    <p className="mb-0 text-sm text-muted-foreground">{member.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-5">
        <SectionHeading
          eyebrow="Products"
          title="Showcase products and learning assets."
          action={
            <Link href="/portfolio" className="btn btn-outline-secondary">
              Explore Portfolio
            </Link>
          }
        />
        <div className="row mt-2 g-4">
          {productShowcase.map((item) => (
            <div key={item.title} className="col-md-6 col-xl-3">
              <div className="theme-surface theme-card-glow h-100 rounded-4 overflow-hidden">
                <div
                  className="d-flex align-items-end p-4"
                  style={{
                    minHeight: "200px",
                    background:
                      "linear-gradient(160deg, color-mix(in srgb, var(--theme-primary) 88%, black), color-mix(in srgb, var(--theme-accent) 72%, black))",
                  }}
                >
                  <span className="rounded-pill bg-white px-3 py-2 text-sm font-semibold text-slate-900">{item.time}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-main py-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="theme-surface theme-card-glow h-100 rounded-4 p-4 p-lg-5">
              <p className="mb-2 text-sm uppercase tracking-[0.22em] text-primary">Process</p>
              <h2 className="font-[family-name:var(--font-heading)] text-4xl font-semibold text-foreground">
                A homepage becomes persuasive when visitors can see the flow.
              </h2>
              <div className="mt-4 row g-3">
                {processSteps.map((item) => (
                  <div key={item.step} className="col-md-6">
                    <div className="rounded-4 border h-100 p-4">
                      <p className="mb-2 text-sm fw-semibold text-primary">{item.step}</p>
                      <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 mb-0 text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div
              className="theme-card-glow h-100 rounded-4 p-4 p-lg-5"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--theme-primary) 88%, black), color-mix(in srgb, var(--theme-accent) 45%, black))",
                color: "var(--theme-hero-text)",
              }}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.22em] opacity-75">CMS Advantage</p>
              <h2 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">
                WordPress feels flexible because it ships with more blocks. We can build that depth here deliberately.
              </h2>
              <p className="mt-3 mb-0 opacity-75">
                The right answer is not to mimic WordPress badly. It is to add reusable sections that fit your brand, then expose the ones worth controlling in the CMS.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-16">
        <SectionHeading
          title="Latest Posts"
          action={
            <Link href="/blog" className="text-sm text-primary hover:underline">
              View all
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="container-main py-5">
        <div className="row align-items-start gy-4">
          <div className="col-lg-4">
            <SectionHeading
              eyebrow="Courses"
              title="Training tracks by level, not random course clutter."
              copy="Structured sections like this make the homepage feel complete and useful for visitors evaluating your brand."
            />
          </div>
          <div className="col-lg-8">
            <div className="row g-4">
              {learningTracks.map((track) => (
                <div key={track.level} className="col-md-4">
                  <div className="theme-surface theme-card-glow h-100 rounded-4 p-4">
                    <p className="mb-3 text-sm font-semibold text-primary">{track.level}</p>
                    <div className="d-flex flex-column gap-2">
                      {track.courses.map((course) => (
                        <div key={course} className="rounded-3 border px-3 py-2 text-sm">
                          {course}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-5">
        <SectionHeading
          eyebrow="Testimonials"
          title="The site needs social proof blocks as well, not only feature lists."
          copy="Without proof, even a good layout feels unfinished. These sections give the homepage a more established business tone."
        />
        <div className="row mt-2 g-4">
          {testimonials.map((item) => (
            <div key={item.name} className="col-lg-4">
              <div className="theme-surface theme-card-glow h-100 rounded-4 p-4 p-lg-5">
                <p className="mb-4 text-base leading-7 text-foreground">{`“${item.quote}”`}</p>
                <div className="border-top pt-3">
                  <p className="mb-1 fw-semibold text-foreground">{item.name}</p>
                  <p className="mb-0 text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-main py-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="theme-surface theme-card-glow rounded-4 p-4 p-lg-5 h-100">
              <p className="text-sm uppercase tracking-[0.22em] text-primary">Training Rules</p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold">
                A clearer process builds trust faster than generic promises.
              </h2>
              <div className="mt-4 d-flex flex-column gap-3">
                {trainingRules.map((rule) => (
                  <div key={rule} className="rounded-4 border px-4 py-3 text-sm text-muted-foreground">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="theme-hero rounded-4 p-4 p-lg-5 h-100">
              <p className="text-sm uppercase tracking-[0.22em] opacity-75">Contact</p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold">
                Start with a conversation, then move into content, products, or training.
              </h2>
              <p className="mt-3 max-w-xl opacity-75">
                Use this section as the homepage closer so visitors always have a direct next step.
              </p>

              <div className="mt-4 row g-3">
                <div className="col-sm-6">
                  <div className="rounded-4 border border-white/25 px-4 py-3">
                    <p className="mb-1 text-sm opacity-75">Email</p>
                    <p className="mb-0 font-semibold">{settings?.contact_email || "hello@example.com"}</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="rounded-4 border border-white/25 px-4 py-3">
                    <p className="mb-1 text-sm opacity-75">Phone</p>
                    <p className="mb-0 font-semibold">{settings?.phone_number || "+92 300 0000000"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 d-flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary btn-lg px-4">
                  Contact Now
                </Link>
                <Link href="/blog" className="btn btn-outline-light btn-lg px-4">
                  Explore Insights
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-5">
        <div className="row align-items-start g-4">
          <div className="col-lg-5">
            <SectionHeading
              eyebrow="FAQ"
              title="A flexible custom CMS gets stronger when the public site answers objections directly."
              copy="This is another type of section WordPress sites often add with plugins or builders. Here it is part of the design language."
            />
          </div>
          <div className="col-lg-7">
            <div className="d-flex flex-column gap-3">
              {faqItems.map((item) => (
                <div key={item.question} className="theme-surface theme-card-glow rounded-4 p-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 mb-0 text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-main pb-20">
        <SectionHeading
          title="Featured Projects"
          action={
            <Link href="/portfolio" className="text-sm text-primary hover:underline">
              View all
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.slice(0, 3).map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
