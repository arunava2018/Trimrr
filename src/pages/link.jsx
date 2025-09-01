import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { 
  Copy, 
  Download, 
  LinkIcon, 
  Trash, 
  ArrowLeft, 
  ExternalLink, 
  Calendar,
  TrendingUp,
  BarChart3,
  QrCode,
  Check,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

const Link = () => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || "qr-code";
    
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = `${fileName}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.error("Download failed:", err));
  };

  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const { loading, data: url, fn, error } = useFetch(getUrl);
  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl);
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl);

  useEffect(() => {
    if (id && user?.id) fn({ id, user_id: user.id });
  }, [id, user?.id]);

  useEffect(() => {
    if (!error && loading === false && id) fnStats(id);
  }, [loading, error, id]);

  const handleCopy = async () => {
    const link = url?.custom_url ? url?.custom_url : url.short_url;
    await navigator.clipboard.writeText(`https://trimrrly.netlify.app/${link}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    await fnDelete(id);
    navigate("/dashboard");
  };

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

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5" />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-20 h-20 border-4 border-red-500/30 rounded-full" />
            <motion.div
              className="absolute inset-0 w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">Loading Link Details</h2>
            <p className="text-gray-400">Fetching analytics and QR code...</p>
            <BarLoader width={200} color="#ef4444" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    navigate("/dashboard");
    return null;
  }

  const link = url?.custom_url ? url?.custom_url : url?.short_url;
  const totalClicks = stats?.length || 0;
  const uniqueDevices = new Set(stats?.map(s => s.device)).size;
  const uniqueLocations = new Set(stats?.map(s => s.city)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="h-12 w-12 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-red-500/50"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-white">Link Analytics</h1>
            <p className="text-gray-400">Detailed insights and performance metrics</p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* Left: Link Information */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Main Info Card */}
            <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                {/* Title */}
                <motion.h2 
                  className="text-4xl font-black text-white leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {url?.title}
                </motion.h2>

                {/* Short URL */}
                <motion.a
                  href={`https://trimrrly.netlify.app/${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xl font-semibold text-red-400 hover:text-red-300 transition-colors break-words group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  trimrrly.netlify.app/{link}
                  <ExternalLink className="inline ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>

                {/* Original URL */}
                <motion.a
                  href={url?.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors break-all group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <LinkIcon className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="truncate">{url?.original_url}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                </motion.a>

                {/* Created Date */}
                <motion.div
                  className="flex items-center gap-3 text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>Created on {new Date(url?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="h-12 px-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/50 text-green-400 hover:bg-green-500/10"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="h-12 px-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      onClick={downloadImage}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download QR
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="h-12 px-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? (
                        <BeatLoader size={5} color="#ef4444" className="mr-2" />
                      ) : (
                        <Trash className="w-5 h-5 mr-2" />
                      )}
                      Delete
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </Card>

            {/* QR Code Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <QrCode className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-bold text-white">QR Code</h3>
                  </div>
                  
                  <motion.div
                    className="relative mx-auto w-fit"
                    whileHover={{ rotate: 2, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20 rounded-3xl blur-xl" />
                    <img
                      src={url?.qr}
                      className="relative w-64 h-64 rounded-3xl border-2 border-red-500/30 bg-white p-4 shadow-2xl"
                      alt="QR Code"
                    />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right: Analytics */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Clicks", value: totalClicks, icon: TrendingUp, color: "red" },
                { label: "Devices", value: uniqueDevices, icon: BarChart3, color: "blue" },
                { label: "Locations", value: uniqueLocations, icon: LinkIcon, color: "green" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={`bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 backdrop-blur-xl border border-${stat.color}-500/20 rounded-2xl p-4 text-center shadow-xl`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-400 mx-auto mb-2`} />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Stats Card */}
            <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-red-400" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>

              {stats && stats.length ? (
                <CardContent className="space-y-8">
                  {/* Location Analytics */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Geographic Distribution
                    </h4>
                    <Location stats={stats} />
                  </motion.div>

                  {/* Device Analytics */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Device Breakdown
                    </h4>
                    <DeviceStats stats={stats} />
                  </motion.div>
                </CardContent>
              ) : (
                <CardContent className="text-center py-16">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <AlertCircle className="w-16 h-16 text-gray-600 mx-auto" />
                    <h3 className="text-xl font-bold text-gray-400">No Analytics Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Share your link to start collecting engagement data and insights
                    </p>
                  </motion.div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center space-y-6">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Delete Link?</h3>
                    <p className="text-gray-400">This action cannot be undone. All analytics data will be permanently lost.</p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 h-12 rounded-2xl border border-gray-700/50 hover:border-gray-500/50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={loadingDelete}
                      className="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white"
                    >
                      {loadingDelete ? <BeatLoader size={5} color="white" /> : 'Delete'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copy Success Notification */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed bottom-6 right-6 bg-green-500/90 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-green-400/30 z-50"
            >
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Link copied to clipboard!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Link;
