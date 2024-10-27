import useStore from "@/store";
import {
  DownloadIcon,
  ImageIcon,
  Link2Icon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { toBlob, toPng, toSvg } from "html-to-image";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

export default function ExportOptions({ targetRef }) {
  const title = useStore((state) => state.title);

  const copyImage = async () => {
    const imgBlob = await toBlob(targetRef.current, {
      pixelRatio: 2,
    });
    const img = new ClipboardItem({ "image/png": imgBlob });
    navigator.clipboard.write([img]);
  };

  const copyLink = () => {
    try {
      const state = useStore.getState();
      const queryParams = new URLSearchParams({
        ...state,
        code: btoa(state.code),
      }).toString();
      navigator.clipboard.writeText(`${location.href}?${queryParams}`);

      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const saveImage = async (name, format) => {
    try {
      let imgUrl, filename;
      switch (format) {
        case "PNG":
          imgUrl = await toPng(targetRef.current, { pixelRatio: 2 });
          filename = `${name}.png`;
          break;
        case "SVG":
          imgUrl = await toSvg(targetRef.current, { pixelRatio: 2 });
          filename = `${name}.svg`;
          break;

        default:
          return;
      }

      const a = document.createElement("a");
      a.href = imgUrl;
      a.download = filename;
      a.click();

      const loading = toast.loading(`Exporting ${format} image...`);
      toast.remove(loading);
      toast.success("Exported successfully!");
    } catch (error) {
      toast.remove(loading);
      toast.error("Something went wrong!");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Share2Icon className="mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark">
        <DropdownMenuItem
          className="gap-2"
          onClick={() =>
            toast.promise(copyImage(), {
              loading: "Copying...",
              success: "Image copied to clipboard",
              error: "Something went wrong",
            })
          }
        >
          <ImageIcon />
          Copy Image
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={() => copyLink()}>
          <Link2Icon />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2"
          onClick={() => saveImage(title, "PNG")}
        >
          <DownloadIcon />
          Save as PNG
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => saveImage(title, "SVG")}
        >
          <DownloadIcon />
          Save as SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
