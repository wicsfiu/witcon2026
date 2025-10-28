
import Title from '../components/text/Title';
import Header from '../components/text/Header';
import Text from '../components/text/Text';


interface Testimonial {
    name: string;
    title?: string;
    quote: string;
}

const testimonials = [
    
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
        <section className='w-full pt-6 pb-10'>
            <Header className='py-6'>Testimonials</Header>
            <div className='grid place-content-center '>
                <div className='w-full align-center mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-15'>
                {testimonials.map((testimonial, index) => (
                    <div className='flex flex-row gap-4'>
                        <div key={index} className='flex-1 p-6 bg-[color:var(--color-secondary-mint)] bg-opacity-70 rounded-xl flex flex-col justify-end items-center space-y-4 hover:scale-105 transition-transform duration-300'>  
                            <div className='text-center'>
                                <Title className='text-lg font-semibold'>{testimonial.name}</Title>
                            </div>
                        </div>
                        <div className='flex-1 p-4 mb-4'>
                            <Text className="w-full whitespace-normal break-words leading-relaxed">"{testimonial.quote}"</Text>
                        </div>
                    </div>
                    ))}
            </div>
            </div>
            
        </section>
    );
}
