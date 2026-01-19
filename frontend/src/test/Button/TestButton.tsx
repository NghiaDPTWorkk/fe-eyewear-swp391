import { Button, IconButton } from '@/shared/components/ui'

const SearchIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const ArrowIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const HeartIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

export default function TestButton() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <Section title="Variants">
        <Button variant="solid">Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </Section>

      <Section title="Color Schemes">
        <Button colorScheme="primary">Primary</Button>
        <Button colorScheme="secondary">Secondary</Button>
        <Button colorScheme="danger">Danger</Button>
        <Button colorScheme="neutral">Neutral</Button>
      </Section>

      <Section title="Sizes">
        <Button size="sm" colorScheme="neutral">Small</Button>
        <Button size="md" colorScheme="neutral">Medium</Button>
        <Button size="lg" colorScheme="neutral">Large</Button>
      </Section>

      <Section title="With Icons">
        <Button leftIcon={<SearchIcon />}>Search</Button>
        <Button rightIcon={<ArrowIcon />}>Next</Button>
        <Button leftIcon={<HeartIcon />} variant="outline" colorScheme="danger">
          Like
        </Button>
      </Section>

      <Section title="Full Width">
        <Button isFullWidth>Full Width Button</Button>
        <Button isFullWidth variant="outline" colorScheme="secondary">
          Full Width Outline
        </Button>
      </Section>

      <Section title="As Link">
        <Button as="a" href="#about">Link Button</Button>
        <Button as="a" href="#products" variant="outline">Outline Link</Button>
      </Section>

      <Section title="Icon Buttons">
        <IconButton icon={<SearchIcon />} aria-label="Search" />
        <IconButton icon={<HeartIcon />} aria-label="Like" colorScheme="danger" />
        <IconButton icon={<ArrowIcon />} aria-label="Next" variant="solid" colorScheme="primary" />
        <IconButton
          icon={<HeartIcon />}
          aria-label="Like"
          variant="solid"
          colorScheme="danger"
          isRound
        />
      </Section>

      <Section title="Icon Button Variants">
        <IconButton icon={<SearchIcon />} aria-label="Solid" variant="solid" colorScheme="primary" />
        <IconButton icon={<SearchIcon />} aria-label="Outline" variant="outline" colorScheme="primary" />
        <IconButton icon={<SearchIcon />} aria-label="Ghost" variant="ghost" colorScheme="primary" />
      </Section>

      <Section title="Disabled">
        <Button isDisabled>Disabled</Button>
        <Button variant="outline" isDisabled>Disabled Outline</Button>
        <IconButton icon={<SearchIcon />} aria-label="Search" isDisabled />
        <IconButton
          icon={<HeartIcon />}
          aria-label="Like"
          variant="solid"
          colorScheme="danger"
          isDisabled
        />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-lg font-medium text-neutral-700">{title}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  )
}
