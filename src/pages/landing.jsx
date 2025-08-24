import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  BarChart3,
  Smartphone,
  Link2,
  ThumbsUp,
  Hand,
} from "lucide-react";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  // For animation control
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const handleShorten = (e) => {
    e.preventDefault();
    if (!longUrl) return;
    navigate(`/auth?createNew=${longUrl}`);
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const features = [
    {
      icon: <ThumbsUp className="w-10 h-10 text-red-500" />,
      title: "Easy",
      desc: "ShortURL is easy and fast, enter the long link to get your shortened link",
    },
    {
      icon: <Link2 className="w-10 h-10 text-red-500" />,
      title: "Shortened",
      desc: "Use any link, no matter what size, ShortURL always shortens",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-red-500" />,
      title: "Secure",
      desc: "It is fast and secure, our service has HTTPS protocol and data encryption",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-red-500" />,
      title: "Statistics",
      desc: "Check the number of clicks that your shortened URL received",
    },
    {
      icon: <Hand className="w-10 h-10 text-red-500" />,
      title: "Reliable",
      desc: "All links that try to disseminate spam, viruses and malware are deleted",
    },
    {
      icon: <Smartphone className="w-10 h-10 text-red-500" />,
      title: "Devices",
      desc: "Compatible with smartphones, tablets and desktop",
    },
  ];

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-11">
      {/* Hero Section */}
      <h2 className="my-10 sm:my-16 text-3xl sm:text-5xl lg:text-6xl text-white text-center font-extrabold">
        The only URL Shortener <br /> you'll ever need! 👇
      </h2>

      {/* URL Shorten Form */}
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      >
        <Input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter your long URL"
          className="h-full flex-1 py-4 px-4"
        />
        <Button className="h-full bg-red-600" type="submit" variant="destructive">
          Shorten!
        </Button>
      </form>

      {/* Learn More Button */}
      <motion.button
        onClick={scrollToHowItWorks}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More ↓
      </motion.button>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-16 w-full">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-900 shadow-md"
          >
            {f.icon}
            <h3 className="mt-4 text-xl font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-gray-300 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={ref}
        className="w-full py-16 px-6 sm:px-12 lg:px-24 bg-black text-white"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          How It Works 🚀
        </h2>
        <div className="grid gap-8 sm:grid-cols-3 text-center">
          {[
            {
              icon: <Link2 className="w-10 h-10 text-red-500 mx-auto" />,
              title: "1. Paste Your URL",
              desc: "Enter your long, messy link in the input box above.",
            },
            {
              icon: <span className="text-red-500 text-4xl">⚡</span>,
              title: "2. Get Short Link",
              desc: "Instantly receive a clean, short URL that’s easy to share.",
            },
            {
              icon: <BarChart3 className="w-10 h-10 text-red-500 mx-auto" />,
              title: "3. Share & Track",
              desc: "Share anywhere and monitor clicks, devices, and more.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="p-6 bg-neutral-900 rounded-2xl shadow-md hover:shadow-red-500/20 transition"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={controls}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <div className="w-full my-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-10">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="multiple"
          collapsible
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>What is a URL shortener?</AccordionTrigger>
            <AccordionContent>
              A URL shortener takes a long web address and converts it into a
              shorter, easy-to-share link that redirects to the original page.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              How do I know your service is reliable and scalable?
            </AccordionTrigger>
            <AccordionContent>
              Our system is built with modern cloud infrastructure, ensuring
              high availability and the ability to handle large volumes of links
              and clicks.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What is a custom URL shortener?</AccordionTrigger>
            <AccordionContent>
              A custom shortener lets you personalize the shortened link with
              your own text or brand name, making it more memorable.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              How do I change a long URL to a short URL?
            </AccordionTrigger>
            <AccordionContent>
              Simply paste your long link into the input box and click "Shorten"
              — your new short link will be generated instantly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              How do I shorten a URL for free?
            </AccordionTrigger>
            <AccordionContent>
              You can use our free plan to shorten unlimited URLs. Advanced
              features may require a premium subscription.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>Which link shortener is best?</AccordionTrigger>
            <AccordionContent>
              Trimrr is fast, secure, and packed with analytics — making it one
              of the best choices for both personal and business use.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>
              Can I change my subscription at any time?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can upgrade, downgrade, or cancel your subscription at
              any time from your account dashboard.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>
              What are the benefits of a short URL?
            </AccordionTrigger>
            <AccordionContent>
              Short URLs are easier to share, track, and brand. They also
              improve click rates and fit better on social media.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger>
              Can I use a domain I already own?
            </AccordionTrigger>
            <AccordionContent>
              Yes! You can connect your custom domain and use it to generate
              branded short links for your business.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger>
              What is your privacy and data protection policy?
            </AccordionTrigger>
            <AccordionContent>
              We follow strict privacy standards. Your data is encrypted and
              never shared with third parties.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default LandingPage;
