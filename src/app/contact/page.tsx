import React from "react";
import Typography from "@/components/Typography";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";

const ContactPage: React.FC = () => {
  return (
    <div className="pt-12">
      <Container>
        <div className="text-center py-20">
          <Typography
            variant="small"
            className="mb-6 uppercase px-2 py-1 bg-blue-500 text-white rounded-full"
          >
            Contact Me
          </Typography>
          <Typography variant="h1" fontWeight="light" className="mt-8">
            Get in Touch
          </Typography>
          <Typography variant="p" className="max-w-2xl mx-auto mt-4">
            I&apos;m always excited to connect with new people. Whether you have
            a question, a project proposal, or just want to say hello, feel free
            to reach out.
          </Typography>
        </div>
        <div className="max-w-2xl mx-auto pb-20">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
