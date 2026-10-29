import Image from "next/image";

export function Footer() {
  return (
    <footer id="site-footer" className="border-line bg-ink-deep border-t px-5 py-10 text-center font-heading text-cream sm:px-8">
      <div className="mx-auto max-w-[1080px]">
        <Image
          src="/brand/key-purpose-white.png"
          alt="Key Purpose"
          width={12530}
          height={2400}
          sizes="202px"
          className="mx-auto h-auto w-[202px]"
        />
        <p className="mt-6 text-[22px] leading-7 font-semibold">
          Copyright © 2026 Karunai Prakash. All Rights Reserved.
        </p>
        <p className="mt-3 text-[16px] leading-5 font-semibold">
          This website is not a part of the Meta website or Meta Platforms, Inc. Additionally, this website is not endorsed by Meta in any way. Meta is a trademark of Meta Platforms, Inc. The results, success stories, and testimonials shared on this website are individual experiences and may vary from person to person. Your results will depend on your background, skills, effort, experience, and commitment to learning and implementation.
        </p>
      </div>
    </footer>
  );
}
