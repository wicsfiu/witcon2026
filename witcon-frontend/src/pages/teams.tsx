import Title from "../components/text/Title";
import Text from "../components/text/Text";
import Header from "../components/text/Header";
import rhode from "../assets/eboard/rhode.png";
import devin from "../assets/eboard/devin.png";
import narel from "../assets/eboard/narel.png";

interface Team {
  name: string;
  position?: string;
  image: string;
}

const WiCS: Team[] = [

    {
        name: "Margarita Guitierrez",
        position: "President",
        image:""
    },

    {
        name: "Amber Garcia",
        position: "Vice President",
        image:""
    },

    {
        name: "Agoritsa",
        position: "Faculty Advisor",
        image:""
    },

    {
        name: "Gabriela Lopez",
        position: "WiTCON Director",
        image:""
    },


    {
        name: "Devin Diaz",
        position: "Industry Relations Director",
        image: devin
    },

    {
        name: "Rhode Sanchez",
        position: "Industry Relations Lead",
        image:rhode
    },


    {
        name: "Narel Rodriguez",
        position: "Industry Relations Chair",
        image:narel
    },

    {
        name: "Victoria Hernandez",
        position: "Industry Relations Chair",
        image:""
    },

    {
        name: "Allison Romero",
        position: "Marketing & Commms Director",
        image:""
    },

    {
        name: "Yana Kostenko",
        position: "Marketing Lead",
        image:""
    },

    {
        name: "Natalia Boodram",
        position: "Marketing Lead",
        image:""
    },

    {
        name: "Manar Alhamad",
        position: "Comms Lead",
        image:""
    },

    {
        name: "Laiba Mahmud",
        position: "Comms Lead",
        image:""
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
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }

                    @media (max-width: 600px) {
                        .comic {
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                        }

                        .panel {
                            height: 160px;
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

      <Header className="col-span-full text-section">Testimonials</Header>
      

      <article className="comic">
        {WiCS.map((member, index) => (
          <div key={index} className="panel">
            <div
              className="panel-image"
              style={
                member.image
                  ? {
                      backgroundImage: `url(${member.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div className="panel-name">{member.name}</div>
              <div className="panel-position">{member.position}</div>
            </div>
          </div>
        ))}
      </article>
    </div>
  );
}
