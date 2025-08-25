import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/useFetch";
// import Error from "./error"; // uncomment if you have an Error component

export default function CreateLink() {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef();

  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [open, setOpen] = useState(false);   // 👈 local dialog state
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup.string().url("Must be a valid URL").required("Long URL is required"),
    customUrl: yup.string(),
  });

  const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl);

  // If query param exists → set longUrl + open dialog
  useEffect(() => {
    if (longLink) {
      setFormValues((prev) => ({ ...prev, longUrl: longLink }));
      setOpen(true);
    }
  }, [longLink]);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data, navigate]);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current?.canvasRef.current;
      let blob = null;
      if (canvas) {
        blob = await new Promise((resolve) => canvas.toBlob(resolve));
      }

      await fnCreateUrl({ ...formValues, user_id: user.id }, blob);
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(res) => {
        setOpen(res);
        if (!res) setSearchParams({}); // clear ?createNew when closed
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>

        {formValues?.longUrl && (
          <QRCode ref={ref} size={250} value={formValues?.longUrl} />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <Input
          id="longUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <p className="text-red-500 text-sm">{errors.longUrl}</p>}

        <div className="flex items-center gap-2">
          <Card className="p-2">hostedLink.com</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error.message || String(error)}</p>}

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
