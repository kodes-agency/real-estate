import { getPayload } from "payload";
import config from "@/payload.config";
import { createCache } from "@/lib/utils";
import { RichText } from "@/components/global/richtext";

export default async function PolicyPage() {
  const payload = await getPayload({ config });
  const getPolicyData = createCache(
    async () =>
      await payload.findGlobal({
        slug: "privacy-policy",
      }),
    [],
    ["privacy-policy"],
  );

  const page = await getPolicyData();

  return (
    <div className="px-[5vw] md:px-[10vw] py-40 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-10 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mb-4 [&_h5]:text-lg [&_h5]:font-bold [&_h5]:mb-3 [&_h6]:text-base [&_h6]:font-bold [&_h6]:mb-2 [&_p]:text-base [&_p]:mb-4 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
      <RichText data={page.content} />
    </div>
  );
}
