import type { HomeContent } from "@/lib/content";

export default function Footer({ footer }: { footer: HomeContent["footer"] }) {
  return (
    <footer>
      <div className="w">
        <span>{footer.copyright}</span>
        <span>
          <a href="https://felicienmukamba.vercel.app" target="_blank" rel="noopener noreferrer">
            {footer.founder}
          </a>
          {" · "}
          <a href="https://www.linkedin.com/in/felicien-mukamba-5b49ab252/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          {" · "}
          <a href="https://github.com/felicienmukamba" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
