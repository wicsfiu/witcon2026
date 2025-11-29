
import Title from '../components/text/Title';
import Header from '../components/text/Header';
import Text from '../components/text/Text';


interface Testimonial {
    name: string;
    title?: string;
    quote: string;
}

const testimonials: Testimonial[] = [
    
    {   
        name: "Jesse Cline",
        title: "UKG, Sponsor",
        quote: "I look forward to WiTCON all year! There is no other space the matches the energy in the room at WiTCON. It is truly an inspiration to see these women creating community and building space to uplift and empower each other.",
    },

    {
        name: "Karletty Medina",
        title: "CodePath, Community Partner",
        quote: "WiTCON offers an incredible opportunity to connect with students and expose them to what the tech industry seeks. As an organization committed to reprogramming CS education, CodePath values the chance to engage directly with students while collaborating with the amazing WiCS Team.",
    },
    {   name: "Agoritsa Polyzou",
        title: "FIU Professor, Advisor",
        quote: "Each year, WiTCON has been an incredible experience—filled with inspiring sessions, valuable networking, and unforgettable moments. This event is open to all, empowering all, and fostering a community where we can thrive, connect, and grow together!",
    },

    {
        name: "Keren Rivera",
        title: "FIU Student, Attendee",
        quote: "I’ve been going for two years and I love the energy this event brings. The participants are kind, the opportunities are abundant, and the workshops are incredibly valuable!",
    }
]

export default function Testimonials() {
    return (

        <div style = {{margin: 0, padding: 0}}>
            <style> 
                {`
                    .text-section{
                        text-align: center;
                        font-family: var(--font-bukhari);
                        font-size: 2.5em;
                        color: var(--color-primary-pink);
                    }

                   .wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    }

                    .wrapper h1 {
                        margin: 50px 0 50px 0;
                        text-transform: uppercase;
                        font-size: 1.5em;
                        text-align: center;
                    }

                    .speechbubble {
                        background-color: #ffffffff;
                        border-color: var(--color-primary-mint);
                        border-width: 2px;
                        border-style: solid;
                        border-radius: 15px;
                        font-size: 0.95em;
                        line-height: 1.75;
                        padding: 20px 20px;
                        margin-bottom: 75px;
                        cursor: default;
                        position: relative;
                        max-width: 800px;
                        margin-left: auto;
                        margin-right: auto;
                        color: var(--color-primary-pink);
                        font-family: 'Actor', sans-serif;
                    }

                    .speechbubble:nth-of-type(even) {
                        border-left: 10px solid var(--color-primary-mint);
                    }
                    
                    .speechbubble:nth-of-type(even)::after {
                        content: '';
                        position: absolute;
                        bottom: -30px;
                        transform: rotate(90deg);
                        left: 6px;
                        width: 0;
                        height: 0;
                        border-left: 30px solid var(--color-primary-mint);
                        border-top: 30px solid transparent;
                    }

                    .speechbubble:nth-of-type(odd) {
                        border-right: 10px solid var(--color-primary-mint);
                    }

                    .speechbubble:nth-of-type(odd)::after {
                        content: '';
                        position: absolute;
                        bottom: -30px;
                        transform: rotate(-90deg);
                        right: 20px;
                        width: 0;
                        height: 0;
                        border-right: 30px solid var(--color-primary-mint);
                        border-top: 30px solid transparent;
                    }

                    .speechbubble p::before {
                        content: """;
                        font-family: 'Actor', serif;
                        font-size: 40px;
                        line-height: 0px;
                        display: inline-block;
                        margin-right: 5px;
                    }
                    
                    .speechbubble .username {
                        display: block;
                        text-align: right;
                        margin-top: 7px;
                        font-style: italic;
                        font-weight: bold;
                    }

                    .speechbubble .username::before {
                        content: "— ";
                    }

                    .speechbubble .title {
                        font-size: 0.85em;
                        color: #666;
                        display: block;
                        margin-top: 1px;
                        text-align: right;
                        color: var(--color-primary-pink);
                        font-weight: bold;
                    }
                    
                
                `}
            </style>

            <Header className="col-span-full text-section">Testimonials</Header>

            <div className= "wrapper">
                
                {testimonials.map((testimonial, index)=>(
                    <div key = {index} className = "speechbubble">
                        <p>
                            {testimonial.quote}
                            <span className = "username">
                                {testimonial.name}
                            </span>

                            <span className = 'title'>
                                {testimonial.title}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
