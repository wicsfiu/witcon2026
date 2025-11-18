
import Title from '../components/text/Title';
import Text from '../components/text/Text';
import Header from "../components/text/Header";

interface Team {
    name: string;
    position?: string;
}
const Executive: Team[] = [
    {
        name: "Margarita Gutierrez",
        position: "President"
    },
    {
        name: "Amber Garcia",
        position: "Vice-President"
    }
]
const industryRelations: Team[] = [
    {
        name: "Devin Diaz",
        position: "Industry Relations Chair"
    },
    {
        name: "Rhode Sanchez",
        position: "Industry Relations Lead"
    },
    {
        name: "Narel Rodriguez",
        position: "Industry Relations Lead"
    },
    {
        name: "Victoria Hernandez",
        position: "Industry Relations Lead"
    },
// make a function for ir, witcon, and then in the export
]


export default function Teams(){
    return (
        <section className = 'w-full pt-6 pb-10'>
        <Header className='py-6'>Teams</Header>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
        <div className="w-full rounded-2xl bg-[color:var(--color-secondary-mint)]/100 py-6 md:p-8 shadow-md flex-row">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6 place-items-center">
        <Title className="text-3xl font-semibold text-center mb-4">Executive</Title> 
        {/* make title on top? */}
        {Executive.map((team, index)=>(
        <div key={index} className="flex flex-col items-center text-cente hover:scale-105 transition-transform duration-300">
          {/* Circle for photo */}
          {/* make a link for everyones linkedin when you click?? */}
          <div className="w-24 h-24 rounded-full bg-neutral-200 overflow-hidden mb-3  ">
            {/* If you have images: */}
            {/* <img src={team.image} alt={team.name} className="w-full h-full object-cover" /> */}
            
          </div>
  
          {/* Name + position */}
          <Text className="font-medium leading-tight">{team.name || 'First Last Name'}</Text>
          <Text className="text-sm opacity-80 leading-tight">{team.position || 'Position'}</Text>
        </div>
    ))}
        </div>
        </div>
        <div className="w-full rounded-2xl bg-[color:var(--color-secondary-mint)]/100 py-6 md:p-8 shadow-md flex-row">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6 place-items-center">
{/* //make another div for each row
//make another grid for each team */}

<Title className="text-3xl font-semibold text-center mb-4">Industry Relations</Title> 
    {industryRelations.map((team, index) => (
      <div key={index} className="flex flex-col items-center text-cente hover:scale-105 transition-transform duration-300
      ">
        {/* Circle for photo */}
        {/* make a link for everyones linkedin when you click?? */}
        <div className="w-24 h-24 rounded-full bg-neutral-200 overflow-hidden mb-3  ">
          {/* If you have images: */}
          {/* <img src={team.image} alt={team.name} className="w-full h-full object-cover" /> */}
        </div>


        {/* Name + position */}
        <Text className="font-medium leading-tight">{team.name || 'First Last Name'}</Text>
        <Text className="text-sm opacity-80 leading-tight">{team.position || 'Position'}</Text>
      </div>
    ))}
  </div>
  </div>
        </div>
        




    </section>);
}