import React from "react";
import PortfolioProjectCard from "./PortfolioProjectCard";
import WorkCard from "./WorkCard";
import EducationCard from "./EducationCard";
import CertificationCard from "./CertificationCard";
import ReviewCard from "./ReviewCard";

function ProfileSection({ type }: { type: string }) {
  // Initializing empty arrays to prevent errors
  let ProjectsData = [
    {
      id: 0,
      title: "",
      description: "",
      images: [""],
      links: [""],
      linkLabels: [""],
    },
  ];
  let WorkData = [
    {
      id: 0,
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      proofLink: "",
    },
  ];
  let EducationData = [
    {
      id: 0,
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      score: "",
      maxScore: "",
      proofLink: "",
    },
  ];
  let CertificationData = [
    {
      id: 0,
      title: "",
      issuingOrganization: "",
      startDate: "",
      endDate: "",
      description: "",
      proofUrl: "",
    },
  ];
  let ReviewData = [
    {
      id: 0,
      reviewerName: "",
      reviewText: "",
      rating: 0,
      imageUrl: "",
    },
  ];

  //   Demo Data
  if (type === "Projects") {
    ProjectsData = [
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
  }
  if (type === "Work Experience") {
    WorkData = [
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
  }
  if (type === "Education") {
    EducationData = [
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
  }
  if (type === "Certifications / Courses") {
    CertificationData = [
      {
        id: 1,
        title: "Certified React Developer",
        issuingOrganization: "React Training",
        startDate: "Jan 2021",
        endDate: "Mar 2021",
        description:
          "Completed an intensive course on React.js and its ecosystem.",
        proofUrl: "https://reacttraining.com/certificates/john-doe",
      },
      {
        id: 2,
        title: "AWS Certified Solutions Architect",
        issuingOrganization: "Amazon Web Services",
        startDate: "Apr 2021",
        endDate: "Jun 2021",
        description:
          "Achieved certification in designing distributed systems on AWS.",
        proofUrl:
          "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
      },
      {
        id: 3,
        title: "Full Stack Web Development",
        issuingOrganization: "Coding Bootcamp",
        startDate: "Jul 2021",
        endDate: "Sep 2021",
        description: "Completed a bootcamp in full stack web development.",
        proofUrl: "https://codingbootcamp.com/certificates/john-doe",
      },
    ];
  }
  if (type === "Reviews") {
    ReviewData = [
      {
        id: 1,
        reviewerName: "Alice Smith",
        reviewText:
          "John is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are top-notch.",
        rating: 5,
        imageUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
      },
      {
        id: 2,
        reviewerName: "Bob Johnson",
        reviewText:
          "Working with John was a pleasure. He is a team player and always willing to go the extra mile to ensure project success.",
        rating: 4,
        imageUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
      },
      {
        id: 3,
        reviewerName: "Catherine Lee",
        reviewText:
          "John's expertise in frontend development significantly improved our application's user experience. Highly recommended!",
        rating: 5,
        imageUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
      },
      {
        id: 4,
        reviewerName: "David Martinez",
        reviewText:
          "John delivered our project ahead of schedule with clean, maintainable code. His communication skills and technical knowledge are impressive.",
        rating: 5,
        imageUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
      },
      {
        id: 5,
        reviewerName: "Emily Chen",
        reviewText:
          "Great collaboration experience with John. He quickly understood our requirements and implemented solutions that exceeded our expectations.",
        rating: 4,
        imageUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAA1BMVEWAgICQdD0xAAAALElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgZViQAAd2fpbUAAAAASUVORK5CYII=",
      },
    ];
  }

  return (
    <div className="flex flex-col gap-5 justify-start items-start w-full">
      <div className="text-l w-fit">{type}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-5">
        {type === "Projects" &&
          ProjectsData.map((card) => (
            <PortfolioProjectCard
              key={card.id}
              title={card.title}
              description={card.description}
              images={card.images}
              links={card.links}
              linkLabels={card.linkLabels}
            />
          ))}
        {type === "Work Experience" &&
          WorkData.map((card) => (
            <WorkCard
              key={card.id}
              title={card.title}
              company={card.company}
              startDate={card.startDate}
              endDate={card.endDate}
              description={card.description}
              proofLink={card.proofLink}
            />
          ))}
        {type === "Education" &&
          EducationData.map((card) => (
            <EducationCard
              key={card.id}
              degree={card.degree}
              institution={card.institution}
              startDate={card.startDate}
              endDate={card.endDate}
              score={card.score}
              maxScore={card.maxScore}
              proofLink={card.proofLink}
            />
          ))}
        {type === "Certifications / Courses" &&
          CertificationData.map((card) => (
            <CertificationCard
              key={card.id}
              title={card.title}
              issuingOrganization={card.issuingOrganization}
              startDate={card.startDate}
              endDate={card.endDate}
              description={card.description}
              proofUrl={card.proofUrl}
            />
          ))}
        {type === "Reviews" &&
          ReviewData.map((card) => (
            <ReviewCard
              key={card.id}
              reviewerName={card.reviewerName}
              reviewText={card.reviewText}
              rating={card.rating}
              imageUrl={card.imageUrl}
            />
          ))}
      </div>
    </div>
  );
}

export default ProfileSection;
