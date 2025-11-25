import Header from "../components/text/Header";
import Title from "../components/text/Title";
import Subtitle from "../components/text/Subtitle";
import Text from "../components/text/Text";
import hero from "../assets/hero.png";

export default function Hero() {
  return (
    // TODO: fix spacing
    <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-10 sm:pt-2 md:pt-4 lg:pt-6 gap-y-8 mt-5">
      <div>
        <img
          className="relative object-cover rounded-3xl"
          src={hero}
          alt="WiTCON 2025 volunteer crew"
        />
      </div>
      <div className="flex flex-col text-left gap-1">
        <Header className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl">WiTCON 2026</Header>
        <Subtitle className="text-primary-pink text-lg sm:text-lg md:text-xl lg:text-2xl">
          WOMEN IN TECHNOLOGY CONFERENCE
        </Subtitle>
        <div className="flex flex-row flex-wrap gap-x-3 gap-y-1">
          <Text className="text-primary-yellow text-base md:text-md lg:text-xl">FIU Graham Center</Text>
          <Text className="text-primary-yellow text-base md:text-md lg:text-xl">March 27th, 2026</Text>
          <Text className="text-primary-yellow text-base md:text-md lg:text-xl">9AM-9PM</Text>
        </div>
        <Text className="text-base lg:text-base">Florida’s largest student-led women in tech conference. Hosted by Women in Computer Science at Florida International
        University</Text>

        <div className="flex flex-row gap-x-2 mt-5 items-center flex-wrap">
          <a
            href="https://lu.ma/hwyplw5v"
            className="inline-block bg-secondary-yellow hover:bg-tertiary-yellow active:bg-primary-yellow text-primary-pink py-2 px-4 rounded-xl max-w-30 text-center text-md lg:text-lg"
          >
            Register
          </a>
          <Text className="text-primary-yellow text-md lg:text-lg">
            Already registered?{" "}
            <a
              href="https://lu.ma/hwyplw5v"
              className="underline text-primary-yellow text-md lg:text-lg hover:text-primary-pink"
            >
              Sign in
            </a>
            .
          </Text>
        </div>
      </div>
    </section>
  );
}
