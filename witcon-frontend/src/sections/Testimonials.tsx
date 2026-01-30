
import Title from '../components/text/Title';
import Header from '../components/text/Header';
import Text from '../components/text/Text';
import Wow from '../assets/Wow.webp'
import Megaphone from '../assets/Megaphone.webp'


interface Testimonial {
    name: string;
    title?: string;
    quote: string;
}

const testimonials: Testimonial[] = [
    
    {   
        name: "Tatiana Rodriguez",
        title: "Student at FIU",
        quote: "I look forward to WiTCON every year! It is such a valuable event to attend as a woman in tech - with the career fair, sponsor workshops, and entertaining activities, the opportunities to create meaningful connections with others in the industry are endless!",
    },

    {
        name: "Rebeca Serralta",
        title: "Student at FIU",
        quote: "WiTCON is honestly a great place for building community. I’ve made a lot of friends, and fellow tech girlies at this event. The environment is chill and fun and there are plenty of engaging activities and workshops to attend. I love the vibe and aesthetic always eats!!!! You can see the dedication the organizers put in behind the scenes.",
    },
    {   name: "Agoritsa Polyzou",
        title: "FIU Professor, Advisor",
        quote: "Each year, WiTCON has been an incredible experience—filled with inspiring sessions, valuable networking, and unforgettable moments. This event is open to all, empowering all, and fostering a community where we can thrive, connect, and grow together!",
    },

    {
        name: "Kerene Rivera",
        title: "FIU Student, Attendee",
        quote: "I’ve been going for two years and I love the energy this event brings. The participants are kind, the opportunities are abundant, and the workshops are incredibly valuable!",
    }
]

export default function Testimonials() {
    return (

        <div style = {{margin: 0, padding: 0}} className = "relative">
            <style> 
                {`
                    .text-section{
                        text-align: center;
                        font-family: var(--font-bukhari);
                        font-size: 2.5em;
                        color: var(--color-primary-pink);
                        margin-bottom: 2.5rem;
                    }

                   .wrapper {
                   justify-content:center;
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
                        border-width: 4px;
                        border-style: solid;
                        font-size: 0.95em;
                        line-height: 1.75;
                        padding: 20px 20px;
                        margin-bottom: 75px;
                        cursor: default;
                        position: relative;

                        color: var(--color-primary-pink);
                        font-family: 'Actor', sans-serif;
                    }

                    .speechbubble:nth-of-type(even) {
                        border-left: 14px solid var(--color-primary-mint);
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
                    
                    .speechbubble:last-of-type {
                        margin-bottom: -40px;
                    }
                    
                
                `}
            </style>

            <img 
                src={Wow}
                alt="Wow"
                className="absolute -top-5 -right-6 md:right-16 w-16 md:w-28 sm:right-20 pointer-events-none z-10"
            />

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

            <img 
                src={Megaphone}
                alt="Megaphone"
                className="absolute -bottom-25 -left-4 md:-left-10 md:-bottom-30 lg:-bottom-30 w-16 md:w-28 pointer-events-none z-10 -scale-x-100"
            />


        </div>
    );
}
