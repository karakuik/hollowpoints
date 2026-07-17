import Layout from '../components/Layout'
import Meta from '../components/Meta'

export default function About() {
  return (
    <Layout>
      <Meta title="About" description="A bit about me." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">
          Who
        </p>
        <h1 className="text-4xl font-bold text-hp-text">About</h1>
      </div>

      <div className="prose prose-invert [--tw-prose-invert-links:#ff4500] max-w-xl">
        <p>
          I'm Ryan, a 29-year-old Software Engineer who likes making cool shit — whether it's for me or for other people to use. You may also know me as <strong>karakuik</strong> from various corners of the internet.
        </p>
        <p>
          I was born and raised in Florida, where I lived most of my life. That's where I fell in love with the ocean and programming, and where I met my now-wife. I later moved to Georgia, where I live in the woods with my two dogs (Dante and Kuzco) and two cats (Steele and Frankie).
        </p>
        <p>
          I hold a Bachelor's in Computer Science from Florida International University, where I learned Java, C, C++, game design, and Unity — along with a pile of other tools I keep tucked away for sudden moments of inspiration. These days I mainly work in C#, ASP.NET, and other MVC frameworks. Someday I want to build my own framework in Kotlin, called <em>Trifecta</em>, drawing inspiration from Laravel, ASP.NET, and Ruby on Rails.
        </p>

        <h2>Hobbies</h2>
        <p>
          Programming aside, my biggest passions are gaming and art. Most of my gaming time these days goes to first-person shooters like Battlefield and Call of Duty, but I also love the MOBA genre, single-player experiences, and games with tight core loops built around incremental challenges — you know, "number go up." I'm also a big A24 fan and have a love for all things horror and spooky.
        </p>

        <h2>Other Interests</h2>
        <p>
          Beyond computer science and gaming, I've got a wide streak of curiosity for other fields — psychology, astronomy, electronics, zoology, and more. I'm no expert in any of them, but I'll happily dive into anything I can read about, always looking to understand a little more.
        </p>
      </div>
    </Layout>
  )
}
