import Header from "../components/text/Header";
import KFSCISImg from "../../public/images/KFSCIS_Logo.png";

interface Partner {
  name: string;
  image: string;
  link?: string;
}

const partners: Partner[] = [
  {
    name: "KFSCIS",
    image: KFSCISImg,
    link: "https://www.cis.fiu.edu/", 
  },
];

export default function CommunityPartners() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <style>
        {`
          .partner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            gap: 10px;
          }

          .partner-tile {
            background-color: white;
            border-top: solid 3px var(--color-primary-pink);
            border-left: solid 3px var(--color-primary-pink);
            border-bottom: solid 6px var(--color-primary-pink);
            border-right: solid 6px var(--color-primary-pink);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease-in-out;

            /* Responsive sizing: big on desktop, scales down on mobile */
            width: clamp(200px, 40vw, 420px);
            height: clamp(100px, 18vw, 200px);
          }

          .partner-tile:hover {
            transform: scale(1.01);
          }

          .partner-tile img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 24px;
          }
        `}
      </style>

      <Header className="col-span-full text-section">Community Partners</Header>

      <article className="partner-container">
        {partners.map((partner, index) => (
          <a
            key={index}
            href={partner.link ?? "#"}
            target={partner.link ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="partner-tile"
            data-name={partner.name}
          >
            <img src={partner.image} alt={partner.name} />
          </a>
        ))}
      </article>
    </div>
  );
}
