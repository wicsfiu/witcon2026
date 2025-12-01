import { Instagram, Linkedin } from "lucide-react";
import { FaDiscord } from "react-icons/fa"; // Discord icon

export default function Footer() {
  return (
    <footer className="w-full bg-primary-pink py-10 px-6 mt-20">
      <div className="max-w-4xl mx-auto text-center">

        {/* Top Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-tertiary-yellow mb-6">
          Stay Up To Date with our News and Notifications!
        </h2>

        {/* Icons */}
        <div className="flex justify-center gap-8 mb-8">
          <a
            href="https://www.instagram.com/wicsfiu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary-yellow hover:text-secondary-mint transition"
          >
            <Instagram className="w-8 h-8" />
          </a>

          <a
            href="https://www.linkedin.com/company/wicsfiu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary-yellow hover:text-secondary-mint transition"
          >
            <Linkedin className="w-8 h-8" />
          </a>

          <a
            href="https://discord.com/invite/yourdiscordlink"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary-yellow hover:text-secondary-mint transition"
          >
            <FaDiscord className="w-8 h-8" />
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-tertiary-yellow max-w-xl mx-auto">
          By registering for WiTCON, all attendees agree to abide by our{" "}
          <a
            href="https://www.canva.com/design/DAG3mF4xUB0/neLb0iokgmgdpACMbABLFw/view?utm_content=DAG3mF4xUB0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h3d237c553d"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-secondary-mint transition"
          >
            Code of Conduct
          </a>.
        </p>
      </div>
    </footer>
  );
}
