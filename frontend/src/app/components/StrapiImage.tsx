import Image from "next/image";

export function StrapiImage(props: Parameters<typeof Image>[0]) {
  return (
    <Image
      {...props}
      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${props.src}`}
    />
  );
}
