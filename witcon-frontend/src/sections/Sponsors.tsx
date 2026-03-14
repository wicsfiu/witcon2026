import Title from '../components/text/Title';
import Text from '../components/text/Text';
import Header from "../components/text/Header";

import AkamaiImg from '../sponsors/Akamai.png';
import BNYImg from '../sponsors/BNY.png';
import ChevronImg from '../sponsors/Chevron.png';
import DatadogImg from '../sponsors/Datadog.png';
import FordImg from '../sponsors/Ford.png';
import GoogleImg from '../sponsors/Google.png';
import PfizerImg from '../sponsors/Pfizer.png';
import MicrosoftImg from '../sponsors/Microsoft.png';
import TruistImg from '../sponsors/Truist.png';
import UKGImg from '../sponsors/UKG.png';
import AssImg from '../sponsors/Ass.png';



interface Sponsors {
    name: string;
    image: string;
    link?: string;
    gridColumn: string;
    gridRow: string;
    mobileGridColumn: string;
    mobileGridRow: string;

}

const Spon: Sponsors[] = [

  {
  name: "Chevron",
  image: ChevronImg,
  link: "https://careers.chevron.com/early-career", 
  gridColumn: "2/3",
  gridRow: "1/4",
  mobileGridColumn: "2/3",
  mobileGridRow: "1/3"
  },
  {
  name: "Akamai",
  image: AkamaiImg,
  link: "https://www.akamai.com/careers/students-and-recent-graduates",
  gridColumn: "3/5",
  gridRow: "7/11",
  mobileGridColumn: "1/3",
  mobileGridRow: "13/16"
  },

  {
    name: "Ford",
    image: FordImg,
    link: "https://www.careers.ford.com/en/programs/students-and-graduates.html",
    gridColumn: "3/5",
    gridRow: "4/7",
    mobileGridColumn: "1/3",
    mobileGridRow: "7/9"
  },

  {
    name: "Pfizer",
    image: PfizerImg,
    link: "https://www.pfizer.com/en/about/careers/early-careers",
    gridColumn: "1/2",
    gridRow: "1/4",
    mobileGridColumn: "1/2",
    mobileGridRow: "1/3"
  },

  {
    name: "DataDog",
    image: DatadogImg,
    link: "https://careers.datadoghq.com/early-careers/",
    gridColumn: "3/4",
    gridRow: "1/4",
    mobileGridColumn: "1/2",
    mobileGridRow: "3/5"
  },


  {
    name: "Truist",
    image: TruistImg,
    link: "https://careers.truist.com/us/en/urstudent",
    gridColumn: "4/5",
    gridRow: "1/4",
    mobileGridColumn: "2/3",
    mobileGridRow: "3/4"
  },

  {
    name: "Google",
    image: GoogleImg,
    link: "https://www.google.com/about/careers/applications/early-career",
    gridColumn: "1/2",
    gridRow: "4/7",
    mobileGridColumn: "2/3",
    mobileGridRow:"4/6"
  },


  {
    name: "Microsoft",
    image: MicrosoftImg,
    link: "https://careers.microsoft.com/v2/global/en/students",
    gridColumn: "2/3",
    gridRow: "4/7",
    mobileGridColumn: "1/2",
    mobileGridRow: "5/7"
  },
  {
    name: "BNY Mellon",
    image: BNYImg,
    link: "https://www.bny.com/corporate/global/en/about-us/careers/students.html",
    gridColumn: "1/3",
    gridRow: "7/9",
    mobileGridColumn: "1/3",
    mobileGridRow:"9/11"
  },
  {
    name: "UKG",
    image: UKGImg,
    link: "https://www.ukg.com/company/careers/early-career-internships",
    gridColumn: "2/3",
    gridRow: "9/11",
    mobileGridColumn: "2/3",
    mobileGridRow: "11/13"
  },

  {
    name: "Assurant",
    image: AssImg,
    link: "https://jobs.assurant.com/en/",
    gridColumn: "1/2",
    gridRow: "9/11",
    mobileGridColumn: "1/2",
    mobileGridRow: "11/13"
  },

]


export default function Sponsors() {

    return (
      <div style={{ margin: 0, padding: 0 }}>
        <style>
          {`
            html, body { margin: 0; padding: 10px; }
            .sponsor-container {
              display: grid;
              padding: 10px;
              gap: 10px;
              grid-template-columns: repeat(4, 1fr);
              grid-auto-rows: 40px;  
              overflow: hidden;
              position: relative;
              transition: transform(1.05) 0.3s ease-in-out;
            }
            
            @media (max-width: 640px){
              .sponsor-container {
                grid-template-columns: repeat(2, 1fr);
                grid-auto-rows: 60px;
              }

              [data-name="Ford"]     { grid-column: 1/2 !important; grid-row: 1/3 !important; }
              [data-name="Chevron"]    { grid-column: 2/3 !important; grid-row: 1/3 !important; }
              [data-name="DataDog"]    { grid-column: 1/2 !important; grid-row: 3/5 !important; }
              [data-name="Truist"]     { grid-column: 2/3 !important; grid-row: 3/5 !important; }
              [data-name="Google"]     { grid-column: 2/3 !important; grid-row: 5/6 !important; }
              [data-name="Microsoft"]  { grid-column: 1/2 !important; grid-row: 5/6 !important; }
              [data-name="Pfizer"]       { grid-column: 1/3 !important; grid-row: 6/8 !important; }
              [data-name="BNY Mellon"] { grid-column: 1/3 !important; grid-row: 9/10 !important; }
              [data-name="Assurant"]   { grid-column: 1/2 !important; grid-row: 8/9 !important; }
              [data-name="UKG"]        { grid-column: 2/3 !important; grid-row: 8/9 !important; }
              [data-name="Akamai"]     { grid-column: 1/3 !important; grid-row: 10/12 !important; }
            }
            @media (min-width: 641px) and (max-width: 1280px){
              [data-name = "Ford"] {padding: -20px}
            }
          
            .megabyte{
              background-color: white;
              border-top: solid 3px var(--color-primary-pink);
              border-left: solid 3px var(--color-primary-pink);
              border-bottom: solid 6px var(--color-primary-pink);
              border-right: solid 6px var(--color-primary-pink);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.3s ease-in-out;
            }
            
            .megabyte:hover {
              transform: scale(1.01);
            }
  
          `}
        </style>

        <Header className="col-span-full text-section">Sponsors</Header>
  
        <article className="sponsor-container">
          {Spon.map((member, index) => (
            <a
              key={index}
              href={member.link ?? "#"}
              target={member.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="megabyte"
              data-name = {member.name}
              style={{
                gridColumn: member.gridColumn,
                gridRow: member.gridRow
              }}
            >
              

              <img
                src={member.image}
                alt={member.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: member.name === "Akamai"? "35px": member.name === "BNY Mellon"? "20px":
                  member.name === "Assurant"? "10px": member.name ==="Microsoft"? "5px": 
                  member.name ==="Google"? "5px": "20px",
                  transform: member.name === "Ford"? "scale(1.3)": undefined,                  
                }}
              />
            </a>
          ))}
        </article>
      </div>
    );
  }
  

