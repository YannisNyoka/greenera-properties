import EnquiryForm from '../components/EnquiryForm';

function Contact() {
  return (
    <div className="container section">
      <h1>Contact Us</h1>
      <p className="text-muted mt-1">Have a question? Send us a message and we'll get back to you.</p>
      <div className="mt-2">
        <EnquiryForm source="contact-page" />
      </div>
    </div>
  );
}

export default Contact;