import Image from "next/image";

type AttorneyPortraitProps = {
  name: string;
  initials: string;
  image?: string;
  featured?: boolean;
};

export function AttorneyPortrait({ name, initials, image, featured }: AttorneyPortraitProps) {
  const size = featured ? "size-48 sm:size-56" : "size-32 sm:size-36";

  if (image) {
    return (
      <div className={`relative ${size} shrink-0 overflow-hidden rounded-full border-2 border-[#c9a227]/50`}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes={featured ? "224px" : "144px"}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full border-2 border-[#c9a227]/40 bg-gradient-to-br from-[#1a2d4a] to-[#0a1220] font-serif text-2xl font-semibold text-[#c9a227] sm:text-3xl`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
