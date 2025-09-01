import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
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
  Zap,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const controls = useAnimation();

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    if (inView) controls.start("visible");
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

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const features = [
    {
      icon: <ThumbsUp className="w-10 h-10 text-red-400" />,
      title: "Easy",
      desc: "ShortURL is easy and fast, enter the long link to get your shortened link",
      gradient: "from-red-500/20 to-pink-500/20",
      border: "border-red-500/30"
    },
    {
      icon: <Link2 className="w-10 h-10 text-blue-400" />,
      title: "Shortened",
      desc: "Use any link, no matter what size, ShortURL always shortens",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30"
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-green-400" />,
      title: "Secure",
      desc: "It is fast and secure, our service has HTTPS protocol and data encryption",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30"
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-purple-400" />,
      title: "Statistics",
      desc: "Check the number of clicks that your shortened URL received",
      gradient: "from-purple-500/20 to-violet-500/20",
      border: "border-purple-500/30"
    },
    {
      icon: <Hand className="w-10 h-10 text-yellow-400" />,
      title: "Reliable",
      desc: "All links that try to disseminate spam, viruses and malware are deleted",
      gradient: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/30"
    },
    {
      icon: <Smartphone className="w-10 h-10 text-indigo-400" />,
      title: "Devices",
      desc: "Compatible with smartphones, tablets and desktop",
      gradient: "from-indigo-500/20 to-blue-500/20",
      border: "border-indigo-500/30"
    },
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "10K+", label: "Active Users" },
    { icon: <Link2 className="w-8 h-8" />, value: "1M+", label: "Links Shortened" },
    { icon: <TrendingUp className="w-8 h-8" />, value: "99.9%", label: "Uptime" },
    { icon: <Globe className="w-8 h-8" />, value: "150+", label: "Countries" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full" />

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-11">
        {/* Hero Section */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center space-y-8 my-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-blue-500/20 backdrop-blur-sm border border-red-500/30 rounded-full text-sm text-gray-300"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            The #1 URL Shortener
            <Zap className="w-4 h-4 text-blue-400" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-white leading-tight"
          >
            The only URL Shortener
            <br />
            <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              you'll ever need!
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your long, messy URLs into clean, trackable links with
            advanced analytics and custom branding.
          </motion.p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 w-full max-w-4xl"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50"
            >
              <div className="text-red-400 mb-2 flex justify-center">{stat.icon}</div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* URL Shorten Form */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-2xl mx-auto mb-8"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-2 shadow-2xl">
            <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="flex-1 h-14 bg-transparent border-0 text-white placeholder:text-gray-400 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="h-14 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300"
                  type="submit"
                >
                  Shorten Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </form>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">
            No signup required • Free forever • Instant results
          </p>
        </motion.div>

        {/* Learn More Button */}
        <motion.button
          onClick={scrollToHowItWorks}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.8 }}
          className="group flex items-center gap-2 px-8 py-4 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 hover:border-red-500/50 text-white rounded-2xl font-semibold transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn How It Works
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ↓
          </motion.div>
        </motion.button>

        {/* Features Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-24 w-full max-w-6xl"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={scaleIn}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`relative group p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border ${feature.border} shadow-2xl overflow-hidden`}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-gray-800/50 rounded-2xl"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          ref={ref}
          className="w-full py-24 px-6 sm:px-12 lg:px-24"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in seconds with our simple 3-step process
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: <Link2 className="w-12 h-12 text-red-400" />,
                title: "1. Paste Your URL",
                desc: "Enter your long, messy link in the input box above.",
                color: "red"
              },
              {
                icon: <Zap className="w-12 h-12 text-yellow-400" />,
                title: "2. Get Short Link",
                desc: "Instantly receive a clean, short URL that's easy to share.",
                color: "yellow"
              },
              {
                icon: <BarChart3 className="w-12 h-12 text-green-400" />,
                title: "3. Share & Track",
                desc: "Share anywhere and monitor clicks, devices, and more.",
                color: "green"
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`relative p-8 bg-gradient-to-br from-${step.color}-500/10 to-${step.color}-600/5 backdrop-blur-xl border border-${step.color}-500/20 rounded-3xl text-center group`}
              >
                {/* Step connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-600 to-transparent" />
                )}
                
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex p-4 bg-gray-800/50 rounded-2xl mb-6"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full my-24 max-w-6xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about our URL shortener
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <Accordion
              type="multiple"
              collapsible
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {[
                {
                  q: "What is a URL shortener?",
                  a: "A URL shortener takes a long web address and converts it into a shorter, easy-to-share link that redirects to the original page.",
                },
                {
                  q: "How do I know your service is reliable and scalable?",
                  a: "Our system is built with modern cloud infrastructure, ensuring high availability and the ability to handle large volumes of links and clicks.",
                },
                {
                  q: "What is a custom URL shortener?",
                  a: "A custom shortener lets you personalize the shortened link with your own text or brand name, making it more memorable.",
                },
                {
                  q: "How do I change a long URL to a short URL?",
                  a: 'Simply paste your long link into the input box and click "Shorten" — your new short link will be generated instantly.',
                },
                {
                  q: "How do I shorten a URL for free?",
                  a: "You can use our free plan to shorten unlimited URLs. Advanced features may require a premium subscription.",
                },
                {
                  q: "Which link shortener is best?",
                  a: "Trimrr is fast, secure, and packed with analytics — making it one of the best choices for both personal and business use.",
                },
                {
                  q: "Can I change my subscription at any time?",
                  a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your account dashboard.",
                },
                {
                  q: "What are the benefits of a short URL?",
                  a: "Short URLs are easier to share, track, and brand. They also improve click rates and fit better on social media.",
                },
                {
                  q: "Can I use a domain I already own?",
                  a: "Yes! You can connect your custom domain and use it to generate branded short links for your business.",
                },
                {
                  q: "What is your privacy and data protection policy?",
                  a: "We follow strict privacy standards. Your data is encrypted and never shared with third parties.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.6, delay: (i % 5) * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30"
                >
                  <AccordionItem value={`item-${i + 1}`} className="border-0">
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline text-white font-semibold">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-300">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full my-24 text-center"
        >
          <div className="bg-gradient-to-r from-red-500/10 to-blue-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
              Ready to shorten your URLs?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Trimrr for their link shortening needs.
            </p>
            <motion.button
              onClick={() => navigate('/auth')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300"
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
