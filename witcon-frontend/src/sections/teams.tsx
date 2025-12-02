import Title from '../components/text/Title';
import Text from '../components/text/Text';
import Header from "../components/text/Header";



interface Team {
    name: string;
    position?: string;
  image: string;
}

const WiCS: Team[] = [

    {
        name: "Margarita Guitierrez",
        position: "President",
        image:"/eboard/marg.png"
    },

    {
        name: "Amber Garcia",
        position: "Vice President",
        image:"/eboard/amber.png"
    },

    {
        name: "Agoritsa",
        position: "Faculty Advisor",
        image:"/eboard/agoritsa.png"
    },

    {
        name: "Gabriela Lopez",
        position: "WiTCON Director",
        image:"/eboard/gabriela.png"
    },

    {
        name: "Sruti Simran",
        position: "WiTCON Chair",
        image:"/eboard/sruti.png"
    },

    {
        name: "Devin Diaz",
        position: "Industry Relations Director",
        image: "/eboard/devin.png"
    },

    {
        name: "Rhode Sanchez",
        position: "Industry Relations Lead",
        image:"/eboard/rhode.png"
    },


    {
        name: "Narel Rodriguez",
        position: "Industry Relations Chair",
        image:"/eboard/narel.png"
    },

    {
        name: "Victoria Hernandez",
        position: "Industry Relations Chair",
        image:"/eboard/victoria.png"
    },
    {
      name: "Aaiena Sattar",
      position: "Treasurer",
      image:"/eboard/aaiena.png"
  },
    {
        name: "Allison Romero",
        position: "Marketing & Commms Director",
        image:"/eboard/allison.png"
    },

    {
        name: "Yana Kostenko",
        position: "Marketing Lead",
        image:"/eboard/yana.png"
    },

    {
        name: "Natalia Boodram",
        position: "Marketing Lead",
        image:"/eboard/natalia.png"
    },

    {
        name: "Manar Alhamad",
        position: "Digital Media",
        image:"/eboard/manar.png"
    },

    {
        name: "Laiba Mahmud",
        position: "Comms Lead",
        image:"/eboard/laiba.png"
    },

    {
      name: "Angela Banov",
      position: "Operations Director",
      image:"/eboard/angela.png"
  },

  {
    name: "Khanh Truong",
    position: "Operations Chair",
    image:"/eboard/khanh.png"
},


    {
      name: "Mahi Patel",
      position: "RSO",
      image:"/eboard/mahi.png"
  },

  {
    name: "Shatoya Gardner",
    position: "Web Dev",
    image:"/eboard/shatoya.png"
},

{
  name: "Alessandra Uribe",
  position: "Web Dev",
  image:"/eboard/alessandra.png"
},

{
  name: "Pooja Lad",
  position: "Creative Director",
  image:"/eboard/pooja.png"
},

{
  name: "Mia Mader",
  position: "Creative Lead",
  image:"/eboard/mia.png"
},

{
  name: "Barbara Semidey",
  position: "Outreach",
  image:"/eboard/barb.png"
},

{
  name: "Aisha Nishat",
  position: "Outreach",
  image:"/eboard/aisha.png"
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
  
            /* 👉 Mobile: force exactly 2 per row */
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
              background-position: center;
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
  
        <article className="comic">
          {WiCS.map((member, index) => (
            <div key={index} className="panel">
              <div
                className="panel-image"
                style={
                  member.image
                    ? { backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : undefined
                }
              >
                {/* you can later set backgroundImage here if you add real photos */}
                <div className="panel-name">{member.name}</div>
                <div className="panel-position">{member.position}</div>
              </div>
            </div>
          ))}
        </article>
      </div>
    );
  }
  