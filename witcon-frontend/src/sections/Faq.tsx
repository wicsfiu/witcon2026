import { useState } from "react";
import Header from "../components/text/Header";
import Text from "../components/text/Text";

export default function Faq() {
  const faqs = [
    {
      question: "Who can attend?",
      answer:
        "The conference is free and open to all students interested in technology, networking, and empowerment, with a focus on celebrating and supporting women in the tech field.",
    },
    {
      question: "Where can I register?",
      answer: (
        <>
          You can register for the event by clicking on the following link:{" "}
          <a
            href="https://lu.ma/hwyplw5v"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-pink underline hover:text-pink-300"
          >
            https://lu.ma/hwyplw5v
          </a>
        </>
      ),
    },
    {
      question: "When and where will the event be held?",
      answer: (
        <>
          When: March 28th, 2025, from 9AM to 7PM <br />
          Where: Graham Center Ballrooms <br />
          <br />
          10955 SW 15th St <br />
          Miami, FL 33199 <br />
          FIU Modesto Maidique Campus
        </>
      ),
    },
    {
      question: "Where do I park?",
      answer: (
        <>
          Not an FIU Student? Email us to register for parking at{" "}
          <a
            href="mailto:wics@fiu.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-pink underline hover:text-pink-300"
          >
            wics@fiu.edu
          </a>
          <br />
          <br />
          <a
            href="https://maps.app.goo.gl/PdyrwhGaaGSaEqrX8?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-pink underline hover:text-pink-300"
          >
            Blue Parking Garage
          </a>
          <br />
          10880 SW 16 ST, Miami, FL 33174
          <br />
          <br />
          <a
            href="https://maps.app.goo.gl/ZvGJMHQcLbBnGVQL9?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-pink underline hover:text-pink-300"
          >
            Gold Parking Garage
          </a>
          <br />
          10720 SW 16 ST, Miami, FL 33165
          <br />
          <br />
          Disclaimer: you must register for free parking before arriving at FIU.
          Parking registrations after the event will not be accepted. WiCS FIU
          is not responsible for parking reimbursements outside the allowed
          garages.
        </>
      ),
    },
    {
      question: "Where can I update my resume?",
      answer:
        "Please check your registration confirmation email. It contains a link to update/submit your resume!",
    },
    {
      question: "Do I need experience to participate?",
      answer:
        "Not at all! No prior experience in technology or any tech major is required. WiTCON features workshops and panels beneficial for all future professionals interested in learning!",
    },
    {
      question: "Do I have to stay at the event the entire time?",
      answer:
        "You may attend whichever parts interest you most. But make sure to arrive by 1 pm to secure your spot—after that, attendance opens to waitlisted participants.",
    },
    {
      question: "What do I need to bring to the conference?",
      answer: (
        <ul className="list-disc ml-5">
          <li>FIU ID / Official Identification</li>
          <li>Note-taking Materials</li>
          <li>Resume / Business Cards</li>
          <li>Charged Electronic Devices</li>
          <li>Comfortable Attire and Footwear</li>
          <li>A Positive Attitude!</li>
        </ul>
      ),
    },
    {
      question: "Who is organizing WiTCON25?",
      answer: (
        <>
          WiTCON 2025 is organized by{" "}
          <a
            href="https://wics.cs.fiu.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-pink underline hover:text-pink-300"
          >
            Women in Computer Science
          </a>{" "}
          at Florida International University.
        </>
      ),
    },
    {
      question: "How can I stay updated about WiTCON?",
      answer: (
        <>
          After registering, check your email for event updates and follow our
          social media!{" "}
          <a
            href="https://linktr.ee/wicsfiu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-pink underline hover:text-pink-300"
          >
            https://linktr.ee/wicsfiu
          </a>
        </>
      ),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section className=" py-12">
      <div className="mx-auto">
        <Header className="text-section"> FAQ </Header>

        <div className="space-y-4 py-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`w-full transition rounded-xl p-5 cursor-pointer
                    ${
                    openIndex === index
                        ? "bg-tertiary-yellow"
                        : "bg-secondary-yellow hover:bg-tertiary-yellow"
                    }
                `}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <Text className="text-lg font-semibold text-left">{faq.question}</Text>
                <span className="text-2xl text-primary-pink">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {openIndex === index && (
                <Text className="mt-3 text-primary-brown text-base text-left">
                  {faq.answer}
                </Text>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
