import LinkCard from "@/components/link-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context";
import { getClicks } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Filter } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { BarLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import CreateLink from "@/components/CreateLink";

const Dashboard = () => {
  const [searchQuery, setsearchQuery] = useState("");
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

  return (
    <div className="flex flex-col gap-10 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-6 w-full">
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#ef4444" />
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Card className="bg-black border border-red-500/40 text-white rounded-2xl shadow-md h-full">
            <CardHeader>
              <CardTitle className="text-red-400">Links Created</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{urls?.length || 0}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Card className="bg-black border border-red-500/40 text-white rounded-2xl shadow-md h-full">
            <CardHeader>
              <CardTitle className="text-red-400">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{clicks?.length || 0}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Header + Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-white">My Links</h1>
        <CreateLink />
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setsearchQuery(e.target.value)}
          className="bg-black border border-red-500/40 text-white rounded-xl pl-4 pr-10 py-2 w-full"
        />
        <Filter className="absolute top-2.5 right-3 text-red-500 w-5 h-5" />
      </div>

      {/* Links List with animation */}
      <div className="flex flex-col gap-6 w-full">
        <AnimatePresence>
          {(filteredUrls || []).map((url) => (
            <motion.div
              key={url.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <LinkCard url={url} fetchUrls={refetchUrls} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
