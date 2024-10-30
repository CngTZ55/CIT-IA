import instagramLogo from "./assets/instagram.svg";

export const Footer = () => {
  return (
    <div className=" bottom-0 left-0 w-full text-center py-2 bg-gray-800 text-white">
      <span className="grid grid-cols-2 items-center justify-center">
        <div>
          <p className="text-center font-semibold">Siguenos en</p>
          <span className="flex flex-row items-center justify-center gap-2">
            <a className="font-semibold" href="https://www.instagram.com/cit_unitec?igsh=MWJscjlqNHg5anNkMQ==">@cit_unitec</a>
            <img className="w-6" src={instagramLogo} alt="Instagram" />
          </span>
        </div>
        <div className="border-b-2 border-[#1FC473] lg:mx-[11em] sm:mx-10">
          <p className="text-2xl text-center font-bold">
            Si puedes idearlo, puedes crearlo.
          </p>
        </div>
      </span>
    </div>
  );
};
