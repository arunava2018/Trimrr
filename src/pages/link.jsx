import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import { motion } from "framer-motion";

const Link = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const { loading, data: url, fn, error } = useFetch(getUrl);

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl);

  useEffect(() => {
    if (id && user?.id) fn({ id, user_id: user.id });
  }, [id, user?.id]);

  useEffect(() => {
    if (!error && loading === false && id) fnStats(id);
  }, [loading, error, id]);

  const handleDelete = async () => {
    await fnDelete(id);
    navigate("/dashboard");
  };

  if (loading || loadingStats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6">
        <motion.div
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <BarLoader width={"200px"} color="#ef4444" />
        <motion.p
          className="text-lg font-semibold text-red-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading Link Details...
        </motion.p>
      </div>
    );
  }

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {/* Left: QR + Link Info */}
      <div className="flex flex-col gap-6 rounded-lg bg-black text-white p-6 border border-red-500 shadow-md">
        <h1 className="text-4xl font-extrabold">{url?.title}</h1>

        <a
          href={`https://hostedLink.in/${link}`}
          target="_blank"
          className="text-2xl text-red-400 font-bold hover:underline break-words"
        >
          https://hostedLink.in/{link}
        </a>

        <a
          href={url?.original_url}
          target="_blank"
          className="flex items-center gap-1 hover:underline text-gray-300 break-all"
        >
          <LinkIcon className="p-1" />
          {url?.original_url}
        </a>

        <span className="text-sm text-gray-400">
          Created on {new Date(url?.created_at).toLocaleString()}
        </span>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-red-400 hover:bg-red-900"
            onClick={() =>
              navigator.clipboard.writeText(`https://hostedLink.in/${link}`)
            }
          >
            <Copy />
          </Button>
          <Button
            variant="ghost"
            className="text-red-400 hover:bg-red-900"
            onClick={downloadImage}
          >
            <Download />
          </Button>
          <Button
            variant="ghost"
            className="text-red-400 hover:bg-red-900"
            onClick={handleDelete}
            disabled={loadingDelete}
          >
            {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
          </Button>
        </div>

        {/* QR Code */}
        <img
          src={url?.qr}
          className="w-56 h-56 mx-auto sm:mx-0 rounded-lg ring-2 ring-red-500 p-2 object-contain"
          alt="qr code"
        />
      </div>

      {/* Right: Stats */}
      <Card className="bg-black text-white border border-red-500">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-red-400">
            Stats
          </CardTitle>
        </CardHeader>
        {stats && stats.length ? (
          <CardContent className="flex flex-col gap-6">
            <Card className="bg-black border border-red-500">
              <CardHeader>
                <CardTitle className="text-xl text-red-400">
                  Total Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.length}</p>
              </CardContent>
            </Card>

            <div>
              <CardTitle className="text-xl text-red-400 mb-2">
                Location Data
              </CardTitle>
              <Location stats={stats} />
            </div>

            <div>
              <CardTitle className="text-xl text-red-400 mb-2">
                Device Info
              </CardTitle>
              <DeviceStats stats={stats} />
            </div>
          </CardContent>
        ) : (
          <CardContent>
            {loadingStats === false
              ? "No Statistics yet"
              : "Loading Statistics..."}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Link;
