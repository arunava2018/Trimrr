import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl);
  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks);

  useEffect(() => {
    if (id) fn(id);
  }, [id]);

  useEffect(() => {
    if (!loading && data) {
      fnStats({ id: data.id, originalUrl: data.original_url });
      // Redirect after a short delay so animation is visible
      const timer = setTimeout(() => {
        window.location.href = data.original_url;
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading || loadingStats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-black text-white">
        {/* Animated Logo / Circle */}
        <motion.div
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />

        {/* Bar Loader */}
        <BarLoader width={"200px"} color="#ef4444" />

        {/* Redirecting Text */}
        <motion.p
          className="text-lg font-semibold text-red-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Redirecting...
        </motion.p>
      </div>
    );
  }

  return null;
};

export default RedirectLink;
