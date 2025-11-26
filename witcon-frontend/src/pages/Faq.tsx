import React from "react";

export default function Faqs() {
  return (
    <div className="min-h-screen w-full bg-[#FADD9C] flex justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-[#FFF0DD] border-[5px] border-[#8ABEE9] rounded-2xl shadow-md shadow-[#00000020] px-6 py-10 md:px-14 md:py-14">

        {/* Title */}
        <h1 className="text-center text-5xl md:text-6xl font-[Fredoka] font-extrabold text-[#894E35] tracking-wide mb-10">
          FAQs
        </h1>

        <div className="space-y-10 text-[#894E35] text-lg leading-[1.75]">

          <section>
            <p className="font-bold text-xl">Q: Who can attend?</p>
            <p className="mt-3">
              A: The conference is free and open to all students interested in technology,
              networking, and empowerment, with a focus on celebrating and supporting women
              in the tech field.
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: When and where will the event be held?</p>
            <p className="mt-3">
              A: <b>When:</b> March 27th, 2026, from 9AM to 7PM<br />
              <b>Where:</b> Graham Center Ballrooms<br />
              10955 SW 15th St<br />
              Miami, FL 33199<br />
              FIU Modesto Maidique Campus
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: Where do I park?</p>
            <p className="mt-3">
              A: Not an FIU Student? Email us to register for parking at:<br />
              <b>wics@fiu.edu</b>
              <br /><br />
              ● <b>Blue Parking Garage</b><br />
              10880 SW 16 ST, Miami, FL 33174<br />
              ● <b>Gold Parking Garage</b><br />
              10720 SW 16 ST, Miami, FL 33165
              <br /><br />
              <i>
                Disclaimer: You must register for free parking before arriving.
                Registrations after the event will not be accepted.
                WiCS FIU is not responsible for reimbursement outside allowed garages.
              </i>
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: Where can I update my resume?</p>
            <p className="mt-3">
              A: You can update your resume directly through your profile page once you’re logged in.
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: Do I need experience to participate?</p>
            <p className="mt-3">
              A: Not at all! WITCON offers workshops and panels that anyone can enjoy,
              regardless of prior experience.
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: Do I have to stay at the event the entire time?</p>
            <p className="mt-3">
              A: You may attend whichever parts interest you.  
              Please arrive by <b>1 PM</b> to secure your spot. After that, we may admit
              students from the waitlist.
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: What do I need to bring to the conference?</p>
            <p className="mt-3">
              ● FIU ID / Government ID<br />
              ● Note-taking materials<br />
              ● Resume / business cards<br />
              ● Charged devices<br />
              ● Comfortable attire & footwear<br />
              ● A positive attitude!
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: Who is organizing WITCON26?</p>
            <p className="mt-3">
              A: WITCON 2026 is organized by Women in Computer Science (WiCS)  
              at Florida International University.
            </p>
          </section>

          <section>
            <p className="font-bold text-xl">Q: How can I stay updated about WITCON?</p>
            <p className="mt-3">
              A: Follow updates through email after registering or via:<br />
              <b>https://linktr.ee/wicsfiu</b>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
