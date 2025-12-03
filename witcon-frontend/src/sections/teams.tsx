import Title from '../components/text/Title';
import Text from '../components/text/Text';
import Header from "../components/text/Header";

interface Team {
    name: string;
    position?: string;
    image: String;
}

const WiCS: Team[] = [

    {
        name: "Margarita Gutierrez",
        position: "President",
        image:""
    },

    {
        name: "Amber Garcia",
        position: "Vice President",
        image:""
    },

    {
        name: "Gabriela Lopez",
        position: "WiTCON Director",
        image:""
    },

    {
        name: "Sruti Simran",
        position: "WiTCON Chair",
        image:""
    },

    {
        name: "Mahi Patel",
        position: "RSO", 
        image: ""
    },

    {
        name: "Aaiena Sattar",
        position: "Treasurer",
        image: ""
    },

    {
        name: "Devin Diaz",
        position: "Industry Relations Director",
        image:""
    },

    {
        name: "Rhode Sanchez",
        position: "Industry Relations Lead",
        image:""
    },


    {
        name: "Narel Rodriguez",
        position: "Industry Relations Chair",
        image:""
    },

    {
        name: "Victoria Hernandez",
        position: "Industry Relations Chair",
        image:""
    },

    {
        name: "Allison Romero",
        position: "Marketing & Comms Director",
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

    {
        name: "Pooja Lad",
        position: "Creative Director",
        image: ""
    },

    {
        name: "Mia Mader",
        position: "Creative Lead",
        image: ""
    },

    {
        name: "Shatoya Gardner",
        position: "Web Developer",
        image:""
    },

    {
        name: "Alessandra Uribe",
        position: "Web Developer",
        image:""
    },

    {
        name: "Aisha Nishat",
        position: "Outreach Lead",
        image: ""
    },

    {
        name: "Barbara Semidey",
        position: "Outreach Lead",
        image: ""
    },

    {
        name: "Angela Banov",
        position: "Operations Director",
        image: ""
    },

    {
        name: "Agatha Gonzalez",
        position: "Operations Lead",
        image: ""
    },

    {
        name: "Khanh Truong",
        position: "Operations Chair",
        image: ""
    },

    {
        name: "Alessandra Ortega",
        position: "Alumni Relations",
        image: ""
    },

    {
        name: "Fer Pacho",
        position: "Alumni Advisor",
        image: ""
    },

    {
        name: "Emily Salgueiros",
        position: "Alumni Advisor",
        image: ""
    }
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
             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
             justify-items: center; /* This centers all items */
           }
           
           
           @media (max-width: 600px) {
             .comic {
               grid-template-columns: repeat(2, minmax(0, 1fr));
               justify-items: center; /* Center on mobile */
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
             width: 100%; /* Ensure panels fill their grid cells */
           }
           
           .panel-image {
             flex: 1;
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
        <Header className="col-span-full text-section pb-6">WiCS Team</Header>
         {WiCS.map((member, index) => (
           <div key={index} className="panel">
             <div className="panel-image">
               <div className="panel-name">{member.name}</div>
               <div className="panel-position">{member.position}</div>
             </div>
           </div>
         ))}
       </article>
     </div>
   );
}
