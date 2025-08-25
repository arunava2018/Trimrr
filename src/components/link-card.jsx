import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LinkIcon, Copy, Download, Trash, Check } from "lucide-react";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { motion } from "framer-motion";

function LinkCard({ url, fetchUrls }) {
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl);
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 1500); // reset after 1.5s
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0px 6px 20px rgba(220,38,38,0.25)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col md:flex-row items-start md:items-center gap-6 
                 border border-gray-800 bg-black 
                 rounded-2xl p-6"
    >
      {/* QR Image */}
      <motion.img
        whileHover={{ rotate: 2, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="h-28 w-28 object-contain ring-2 ring-red-500/70 rounded-xl shadow-md"
        src={url?.qr}
        alt="qr code"
      />

      {/* Info */}
      <div className="flex flex-col flex-1 gap-2">
        <Link to={`/link/${url?.id}`}>
          <h2 className="text-2xl font-bold text-white hover:text-red-400 transition">
            {url?.title}
          </h2>
        </Link>
        <a
          href={`https://trimrrly.netlify.app/${url?.custom_url || url.short_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 text-lg font-medium hover:underline"
        >
          https://trimrrly.netlify.app/{url?.custom_url || url.short_url}
        </a>
        <div className="flex items-center gap-2 text-gray-400 text-sm max-w-xs md:max-w-sm lg:max-w-md truncate">
          <LinkIcon className="w-4 h-4 text-red-400 shrink-0" />
          <span className="truncate">{url?.original_url}</span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 self-end md:self-auto">
        {/* Copy */}
        <motion.div whileTap={{ scale: 0.85 }}>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-500/20"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-red-400" />
            )}
          </Button>
        </motion.div>

        {/* Download */}
        <motion.div whileTap={{ scale: 0.85 }}>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-500/20"
            onClick={downloadImage}
          >
            <Download className="w-5 h-5 text-red-400" />
          </Button>
        </motion.div>

        {/* Delete */}
        <motion.div whileTap={{ scale: 0.85 }}>
          <Button
            variant="ghost"
            onClick={() => fnDelete(url.id).then(() => fetchUrls())}
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <BeatLoader size={5} color="white" />
            ) : (
              <Trash className="w-5 h-5 text-red-400" />
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LinkCard;
