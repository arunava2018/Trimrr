import LinkCard from "@/components/link-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context";
import { getClicks } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Filter, TrendingUp, Link2, BarChart3, Search, Plus } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { BarLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import CreateLink from "@/components/CreateLink";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicks);

  // Stable callback for refetching URLs
  const refetchUrls = useCallback(() => {
    if (user?.id) fnUrls(user.id);
  }, [user?.id, fnUrls]);

  useEffect(() => {
    if (user?.id) fnUrls(user.id);
  }, [user?.id]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) fnClicks(urls.map((url) => url.id));
  }, [urls]);

  // Calculate additional stats
  const avgClicksPerLink = urls?.length ? Math.round((clicks?.length || 0) / urls.length) : 0;
  const mostPopularLink = urls?.reduce((prev, current) => {
    const prevClicks = clicks?.filter(click => click.url_id === prev?.id)?.length || 0;
    const currentClicks = clicks?.filter(click => click.url_id === current.id)?.length || 0;
    return currentClicks > prevClicks ? current : prev;
  }, urls?.[0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const statsCards = [
    {
      title: "Links Created",
      value: urls?.length || 0,
      icon: Link2,
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-500/10 to-purple-600/10",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Total Clicks",
      value: clicks?.length || 0,
      icon: TrendingUp,
      gradient: "from-red-500 to-pink-600",
      bgGradient: "from-red-500/10 to-pink-600/10",
      borderColor: "border-red-500/30"
    },
    {
      title: "Avg Clicks/Link",
      value: avgClicksPerLink,
      icon: BarChart3,
      gradient: "from-green-500 to-teal-600",
      bgGradient: "from-green-500/10 to-teal-600/10",
      borderColor: "border-green-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col gap-8 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-8 w-full">
        {/* Loading bar with enhanced styling */}
        <AnimatePresence>
          {(loading || loadingClicks) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm p-4"
            >
              <BarLoader width={"100%"} color="#ef4444" height={4} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Monitor your link performance and track engagement metrics
          </p>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl border ${stat.borderColor} text-white rounded-2xl shadow-2xl h-full relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <CardHeader className="relative z-10 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-300 text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.p 
                    className="text-4xl font-black text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value.toLocaleString()}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Header + Create Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white">My Links</h2>
            <p className="text-gray-400">
              {filteredUrls?.length || 0} of {urls?.length || 0} links
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CreateLink />
          </motion.div>
        </motion.div>

        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative w-full max-w-2xl mx-auto"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-red-400" />
            <Input
              type="text"
              placeholder="Search your links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 backdrop-blur-xl border border-red-500/30 text-white rounded-2xl pl-12 pr-12 py-4 w-full text-lg placeholder:text-gray-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            />
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500/60 w-5 h-5" />
          </div>
        </motion.div>

        {/* Enhanced Links List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-6 w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredUrls?.length ? (
              filteredUrls.map((url, index) => (
                <motion.div
                  key={url.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.05
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -30, 
                    scale: 0.9,
                    transition: { duration: 0.2 }
                  }}
                  whileHover={{ 
                    y: -4,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  layout
                >
                  <LinkCard url={url} fetchUrls={refetchUrls} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 space-y-4"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500/20 to-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-red-500/30">
                  <Link2 className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {searchQuery ? 'No matching links found' : 'No links created yet'}
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Try adjusting your search terms or create a new link'
                    : 'Create your first shortened link to get started with analytics'
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
