import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LinkIcon, Copy, Download, Trash, Check, ExternalLink, Calendar, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { motion, AnimatePresence } from "framer-motion";

function LinkCard({ url, fetchUrls }) {
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://trimrrly.netlify.app/${url?.custom_url || url?.short_url}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const qrVariants = {
    hover: {
      rotate: [0, -2, 2, 0],
      scale: 1.1,
      transition: {
        rotate: {
          duration: 0.5,
          ease: "easeInOut"
        },
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.9 }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/5 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Main card */}
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 
                     border border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-black/90 
                     backdrop-blur-xl rounded-3xl p-6 overflow-hidden
                     shadow-2xl group-hover:shadow-red-500/20">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl" />

        {/* QR Code Section */}
        <motion.div 
          variants={qrVariants}
          whileHover="hover"
          className="relative shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl blur-lg" />
          <img
            className="relative h-32 w-32 object-contain rounded-2xl shadow-2xl border border-red-500/30 bg-white/5 backdrop-blur-sm"
            src={url?.qr}
            alt="QR Code"
          />
          
          {/* QR overlay effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl flex items-center justify-center"
          >
            <Download className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 gap-3 min-w-0">
          {/* Title */}
          <Link to={`/link/${url?.id}`} className="group/title">
            <motion.h2 
              className="text-2xl font-black text-white group-hover/title:text-red-400 transition-colors duration-300 line-clamp-1"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {url?.title}
              <ExternalLink className="inline ml-2 w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-opacity" />
            </motion.h2>
          </Link>

          {/* Short URL */}
          <motion.a
            href={`https://trimrrly.netlify.app/${url?.custom_url || url.short_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 text-lg font-semibold hover:text-red-300 transition-colors duration-200 flex items-center gap-2 group/url"
            whileHover={{ x: 4 }}
          >
            <span className="truncate">
              trimrrly.netlify.app/{url?.custom_url || url.short_url}
            </span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover/url:opacity-100 shrink-0 transition-opacity" />
          </motion.a>

          {/* Original URL */}
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <LinkIcon className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate max-w-xs lg:max-w-md">{url?.original_url}</span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span>{formatDate(url?.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex gap-2 self-end lg:self-center shrink-0">
          {/* Copy Button */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm hover:border-red-500/50"
              onClick={handleCopy}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Check className="w-5 h-5 text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Copy className="w-5 h-5 text-red-400" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {copied ? 'Copied!' : 'Copy link'}
              </div>
            </Button>
          </motion.div>

          {/* Download Button */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm hover:border-blue-500/50"
              onClick={downloadImage}
            >
              <Download className="w-5 h-5 text-blue-400" />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Download QR
              </div>
            </Button>
          </motion.div>

          {/* Delete Button */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm hover:border-red-500/50"
              onClick={() => fnDelete(url.id).then(() => fetchUrls())}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="#ef4444" />
              ) : (
                <Trash className="w-5 h-5 text-red-400" />
              )}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Delete
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Success feedback for copy */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="absolute top-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-2xl backdrop-blur-sm border border-green-400/30"
            >
              ✓ Link copied!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default LinkCard;
