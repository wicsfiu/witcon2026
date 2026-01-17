import Title from '../components/text/Title';
import Text from '../components/text/Text';
import Header from "../components/text/Header";



interface Team {
    name: string;
    position?: string;
    image: string;
    panelClassName?: string;
    link?: string;

}

const WiCS: Team[] = [

  {
    name: "Gabriela Lopez",
    position: "WiTCON Director",
    image:"/eboard/gabriela.png",
    panelClassName: "panel-gabriela",
    link: "https://www.linkedin.com/in/gabriela-lopez-fiu/",
    

},
{
  name: "Yana Kostenko",
  position: "WiTCON Chair",
  image:"/eboard/yana.png",
  link: "https://www.linkedin.com/in/yana-kostenko/",
  
},

    {
        name: "Margarita Guitierrez",
        position: "President",
        image:"/eboard/marg.png",
        link: "https://www.linkedin.com/in/margarita-rosa/",
    },

    {
        name: "Amber Garcia",
        position: "Vice President",
        image:"/eboard/amber.png",
        link: "https://www.linkedin.com/in/amberg12/",
    },

    {
        name: "Agoritsa Polyzou",
        position: "Faculty Advisor",
        image:"/eboard/agoritsa.png",
        link: "https://www.linkedin.com/in/agoritsa-polyzou/",
    },
    

    {
        name: "Devin Diaz",
        position: "Industry Relations Director",
        image: "/eboard/devin.png",
        link: "https://www.linkedin.com/in/devinldiaz/",
    },

    {
        name: "Rhode Sanchez",
        position: "Industry Relations Lead",
        image:"/eboard/rhode.png",
        link: "https://www.linkedin.com/in/rhode-sanchez/",
    },


    {
        name: "Narel Rodriguez",
        position: "Industry Relations Chair",
        image:"/eboard/narel.png",
        link: "https://www.linkedin.com/in/narel-rodriguez/",
    },

    {
        name: "Victoria Hernandez",
        position: "Industry Relations Chair",
        image:"/eboard/victoria.png",
        panelClassName: "panel-fix",
        link: "https://www.linkedin.com/in/victoriadez/",
    },
    {
      name: "Aaiena Sattar",
      position: "Treasurer",
      image:"/eboard/aaiena.png",
      link: "",
  },
    {
        name: "Allison Romero",
        position: "Marketing & Comms Director",
        image:"/eboard/allison.png",
        link: "https://www.linkedin.com/in/allisonrome5002/",
    },

    

    {
        name: "Natalia Boodhram",
        position: "Marketing Lead",
        image:"/eboard/natalia.png",
        panelClassName: "panel-natalia",
        link: "https://www.linkedin.com/in/nataliaboodhram/",
    },

    {
        name: "Manar Alhamad",
        position: "Comms Lead",
        image:"/eboard/manar.png",
        link: "http://linkedin.com/in/manar-alhamad",
    },

    {
        name: "Laiba Mahmud",
        position: "Digital Media",
        image:"/eboard/laiba.png",
        link: "https://www.linkedin.com/in/laibam/",
    },

    {
      name: "Angela Banov",
      position: "Operations Director",
      image:"/eboard/angela.png",
      link: "https://www.linkedin.com/in/angela-banov-168953232/",
  },

  {
    name: "Khanh Truong",
    position: "Operations Chair",
    image:"/eboard/khanh.png",
    link: "https://www.linkedin.com/in/khanhtruong2610/",
},


    {
      name: "Mahi Patel",
      position: "RSO",
      image:"/eboard/mahi.png",
      link: "https://www.linkedin.com/in/mahipatel18/",
  },

  {
    name: "Shatoya Gardner",
    position: "Web Dev",
    image:"/eboard/shatoya.png",
    link: "https://www.linkedin.com/in/shatoya-gardner/",
},

{
  name: "Alessandra Uribe",
  position: "Web Dev",
  image:"/eboard/alessandra.png",
  panelClassName: "panel-alessandra",
  link: "https://www.linkedin.com/in/aleuribeencina05/",
},

{
  name: "Pooja Lad",
  position: "Creative Director",
  image:"/eboard/pooja.png",
  panelClassName: "panel-fix",
  link: "https://www.linkedin.com/in/pooja-lad/",
  
},

{
  name: "Mia Mader",
  position: "Creative Lead",
  image:"/eboard/mia.png",
  link: "https://www.linkedin.com/in/mia-mader-1a6a13278/",
},

{
  name: "Barbara Semidey",
  position: "Outreach Lead",
  image:"/eboard/barb.png",
  panelClassName: "panel-fix",
  link: "https://www.linkedin.com/in/barbarasemidey/",
},

{
  name: "Aisha Nishat",
  position: "Outreach Lead",
  image:"/eboard/aisha.png",
  link: "https://www.linkedin.com/in/aisha-nish-aisha/",
},

{
  name: "Emily Salgueiros",
  position: "Alumni Advisor",
  image:"/eboard/emily.png",
  link: "https://www.linkedin.com/in/emily-salgueiros"
},

{
  name: "Fer Pacheco",
  position: "Alumni Advisor",
  image:"/eboard/fer.png",
  link: "https://www.linkedin.com/in/pmfer/",
},

{
  name: "Alessandra Ortega",
  position: "Alumni Relations",
  image:"/eboard/ale.png",
  panelClassName: "panel-fix",
  link: "https://www.linkedin.com/in/alessandra-ortega-arrieta/",
},

]


export default function Teams() {

    return (
      <div style={{ margin: 0, padding: 0 }}>
        <style>
          {`
            html, body { margin: 0; padding: 0; }
  
            .comic {
              display: grid;
              padding: 5px;
              gap: 10px;
              justify-items: stretch;
              /* Desktop / default: as many 200px panels per row as fit */
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
  
            
            @media (max-width: 600px) {
              .comic {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
  
              .panel {
                height: 160px; /* optional: slightly shorter on mobile */
              }
  
              .panel-name,
              .panel-position {
                font-size: 0.8rem;
                padding: 2px 6px;
              }
            }
  
            .panel {
              background-color: var(--color-secondary-pink);
              background-image:
                radial-gradient(var(--color-primary-pink) 20%, transparent 20%),
                radial-gradient(#fafafa 20%, transparent 20%);
              background-position: 0 0, 5px 5px;
              background-size: 10px 10px;
              border: solid 2px var(--color-primary-pink);
              box-shadow: 0 6px 6px -6px #c2ae82;
              display: flex;
              flex-direction: row;
              height: 200px;
              overflow: hidden;
              position: relative;
            }
            
              
            .panel-image {
              flex: 1;
              width: 100%;
              height: 100%;
              position: relative;
              background-size: cover;
              background-position: top;
            }

            .panel-fix{
            background-position: center;
            }

            

            .panel-alessandra{
            background-position: top -10px center;
            }

            .panel-natalia{
              background-position: top -80px center;
            }

            .panel-gabriela{
              background-position: bottom 60% center;
            }

            

            
  
            .panel-name {
              position: absolute;
              top: -6px;
              right: -6px;
              background-color: #fff;
              padding: 3px 10px;
              border: solid 2px var(--color-primary-pink);
              font-size: 0.75em;
              transform: skew(-15deg);
            }
  
            .panel-position {
              position: absolute;
              bottom: -6px;
              left: -6px;
              background-color: #fff;
              padding: 3px 10px;
              border: solid 2px var(--color-primary-pink);
              font-size: 0.75em;
              transform: skew(-15deg);
            }
          `}
        </style>

        <Header className="col-span-full text-section">Meet the Team!</Header>
  
        <article className="comic">
  {WiCS.map((member, index) => (
    <a
      key={index}
      href={member.link ?? "#"}
      target={member.link ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="panel"
      style={{ display: "block" }}
    >
      <div
        className={`panel-image ${member.panelClassName ?? ""}`}
        style={
          member.image
            ? { backgroundImage: `url(${member.image})`, backgroundSize: "cover" }
            : undefined
        }
      >
        <div className="panel-name">{member.name}</div>
        <div className="panel-position">{member.position}</div>
      </div>
    </a>
  ))}
</article>

      </div>
    );
  }
  
