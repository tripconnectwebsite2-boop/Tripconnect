import Admin3DLogoIntro from "@/components/admin/Admin3DLogoIntro";

export default function AdminLoading() {
  return (
    <Admin3DLogoIntro
      forceShow={true}
      autoClose={false}
      durationMs={1800}
    />
  );
}
