import React from "react";
import Navbar from "../components/Navbar";
import ProfileSection from "../components/ProfileSection";

function Profile() {
  // Demo data for all sections
  const projectsData = [
    {
      id: 1,
      title: "Project Title 1",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        "https://www.polytec.com.au/img/products/960-960/mercurio-grey.jpg",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=960&h=960&fit=crop",
      ],
      links: [
        "https://github.com/example/project1",
        "https://project1-demo.netlify.app",
      ],
      linkLabels: ["GitHub Repo", "Live Demo"],
    },
    {
      id: 2,
      title: "Project Title 2",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        "https://www.polytec.com.au/img/products/960-960/mercurio-grey.jpg",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=960&h=960&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=960&h=960&fit=crop",
      ],
      links: ["https://project2-demo.vercel.app"],
      linkLabels: ["Lorem Ipsum"],
    },
    {
      id: 3,
      title: "Project Title 3",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      images: [
        "https://www.polytec.com.au/img/products/960-960/mercurio-grey.jpg",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=960&h=960&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=960&h=960&fit=crop",
      ],
      links: [
        "https://www.lipsum.com/",
        "https://github.com/example/project3",
        "https://project3-demo.herokuapp.com",
      ],
      linkLabels: ["Lorem Ipsum", "GitHub Repo", "Live Demo"],
    },
  ];

  const workData = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      startDate: "Jan 2023",
      endDate: "Present",
      description:
        "Led a team of 5 developers in building responsive web applications using React and TypeScript. Implemented modern UI/UX designs and improved application performance by 40%.",
      proofLink: "https://techcorp.com/team/john-doe",
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "StartupXYZ",
      startDate: "Jun 2021",
      endDate: "Dec 2022",
      description:
        "Developed and maintained web applications using Node.js, React, and MongoDB. Built RESTful APIs and collaborated with product teams to deliver features on tight deadlines.",
      proofLink: "https://startupxyz.com/about",
    },
    {
      id: 3,
      title: "Software Developer Intern",
      company: "Digital Innovations Inc",
      startDate: "May 2020",
      endDate: "Aug 2020",
      description:
        "Assisted in developing mobile applications using React Native. Participated in code reviews, testing, and documentation. Gained experience in agile development methodologies.",
      proofLink: "https://digitalinnovations.com/internship-program",
    },
  ];

  const educationData = [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Example",
      startDate: "Sep 2018",
      endDate: "Jun 2022",
      score: "3.8",
      maxScore: "4.0",
      proofLink: "https://universityofexample.com/diploma/john-doe",
    },
    {
      id: 2,
      degree: "Master of Science in Software Engineering",
      institution: "Tech University",
      startDate: "Sep 2022",
      endDate: "Present",
      score: "N/A",
      maxScore: "4.0",
      proofLink: "https://techuniversity.com/diploma/john-doe",
    },
  ];

  const certificationData = [
    {
      id: 1,
      title: "Certified React Developer",
      issuingOrganization: "React Training",
      startDate: "Jan 2021",
      endDate: "Mar 2021",
      description:
        "Completed an intensive course on React.js and its ecosystem.",
      proofLink: "https://reacttraining.com/certificates/john-doe",
    },
    {
      id: 2,
      title: "AWS Certified Solutions Architect",
      issuingOrganization: "Amazon Web Services",
      startDate: "Apr 2021",
      endDate: "Jun 2021",
      description:
        "Achieved certification in designing distributed systems on AWS.",
      proofLink:
        "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    },
    {
      id: 3,
      title: "Full Stack Web Development",
      issuingOrganization: "Coding Bootcamp",
      startDate: "Jul 2021",
      endDate: "Sep 2021",
      description: "Completed a bootcamp in full stack web development.",
      proofLink: "https://codingbootcamp.com/certificates/john-doe",
    },
  ];

  const reviewData = [
    {
      id: 1,
      giver: "Alice Smith",
      comment:
        "John is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are top-notch.",
      rating: 5,
      profilePicture:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
    },
    {
      id: 2,
      giver: "Bob Johnson",
      comment:
        "Working with John was a pleasure. He is a team player and always willing to go the extra mile to ensure project success.",
      rating: 4,
      profilePicture:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
    },
    {
      id: 3,
      giver: "Catherine Lee",
      comment:
        "John's expertise in frontend development significantly improved our application's user experience. Highly recommended!",
      rating: 5,
      profilePicture:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
    },
    {
      id: 4,
      giver: "David Martinez",
      comment:
        "John delivered our project ahead of schedule with clean, maintainable code. His communication skills and technical knowledge are impressive.",
      rating: 5,
      profilePicture:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
    },
    {
      id: 5,
      giver: "Emily Chen",
      comment:
        "Great collaboration experience with John. He quickly understood our requirements and implemented solutions that exceeded our expectations.",
      rating: 4,
      profilePicture:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
    },
  ];

  return (
    <div className="p-10 flex flex-col gap-10">
      <Navbar />
      <div className="flex flex-col gap-10 items-center">
        <div className="flex flex-row gap-3 bg-bglight text-s w-fit h-fit rounded-full">
          <button className="px-20 py-10 rounded-full bg-accent text-bgdark font-semibold">
            Personal Profile
          </button>
          <button className="px-20 py-10 rounded-full hover:bg-accent hover:text-bgdark hover:font-semibold">
            Account Settings
          </button>
        </div>
        <div className="flex flex-row gap-10 w-full h-fit">
          <div className="w-75 h-75 bg-muted rounded-full shrink-0"></div>
          <div className="flex flex-col gap-5 w-full justify-center">
            <div className="flex flex-row gap-5 text-l justify-start items-start">
              <p className="">Aaryan Kakkar</p>
              <p className="text-muted">Developer</p>
            </div>
            <p className="text-muted2">15/10/2003 | India | Male</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              ultrices turpis vel luctus fermentum. Duis accumsan eget velit
              maximus tincidunt. Fusce fringilla placerat elit, id hendrerit
              neque auctor nec. Nunc suscipit justo id velit dapibus,
              pellentesque vulputate est pellentesque. Phasellus in velit
              rhoncus, molestie ipsum a, semper lectus. Curabitur sollicitudin
              dolor at mi elementum malesuada. Cras accumsan pellentesque ex,
              vel auctor neque tincidunt non.
            </p>
            <p>Frontend Engineer | Backend Designer | Fullstack Developer</p>
          </div>
        </div>
        <ProfileSection type="Projects" data={projectsData} />
        <ProfileSection type="Work Experience" data={workData} />
        <ProfileSection type="Education" data={educationData} />
        <ProfileSection
          type="Certifications / Courses"
          data={certificationData}
        />
        <ProfileSection type="Reviews" data={reviewData} />
      </div>
    </div>
  );
}

export default Profile;
