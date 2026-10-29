import type { TechGroupKey } from "@/lib/data";

// Background code for each technology's artwork (decorative only).
const code: Record<TechGroupKey, string> = {
  nextjs: `export default function Page() {
  const [active, setActive] = useState(null);

  return (
    <main className="site">
      <Hero onSelect={setActive} />
      <Services active={active} />
      <Work />
      <Contact />
    </main>
  );
}

export async function generateMetadata() {
  return { title: "Deventeck" };
}`,
  wordpress: `<?php
add_action( 'wp_enqueue_scripts', function () {
  wp_enqueue_style( 'theme', get_stylesheet_uri() );
} );

if ( have_posts() ) :
  while ( have_posts() ) : the_post();
    the_title( '<h2>', '</h2>' );
    the_content();
  endwhile;
endif;

get_template_part( 'template-parts/footer' );`,
  ai: `from openai import OpenAI

client = OpenAI()

def answer(question: str, context: list[str]) -> str:
    prompt = "\\n".join(context) + "\\n\\nQ: " + question
    reply = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return reply.choices[0].message.content

for ticket in inbox.unread():
    ticket.reply(answer(ticket.text, docs.search(ticket.text)))`,
  cyber: `server {
    listen 443 ssl http2;
    server_name app.example.com;

    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header Content-Security-Policy "default-src 'self'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    ssl_protocols TLSv1.2 TLSv1.3;
    limit_req zone=login burst=5 nodelay;
}`,
  games: `public class PlayerController : MonoBehaviour
{
    [SerializeField] float speed = 6f;
    [SerializeField] float jumpForce = 8f;
    Rigidbody body;

    void Awake() => body = GetComponent<Rigidbody>();

    void Update()
    {
        var input = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
        body.velocity = new Vector3(input.x * speed, body.velocity.y, input.z * speed);
        if (Input.GetButtonDown("Jump")) body.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
    }
}`,
  ux: `:root {
  --color-primary: #3B4BDB;
  --color-surface: #FFFFFF;
  --radius-md: 16px;
  --space-4: 16px;
  --font-heading: "Unbounded", sans-serif;
}

.button {
  min-height: 48px;
  padding: 0 var(--space-4);
  border-radius: 999px;
  background: var(--color-primary);
}`,
};

export default function TechArt({ group, title, tools }: { group: TechGroupKey; title: string; tools: string[] }) {
  return (
    <div className="tech-art" aria-hidden="true">
      <pre className="tech-art-code">{code[group]}</pre>
      <div className="tech-art-front">
        <span className="tech-art-title">{title}</span>
        <ul className="tech-art-tools">
          {tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}