import Image from "next/image";

export function StrapiImage(props: Parameters<typeof Image>[0]) {
  return (
    <Image
      {...props}
      src={props.src ? `/strapi${props.src}` : "/favicon.ico"}
    />
  );
}
