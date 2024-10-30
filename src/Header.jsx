import citLogo from "./assets/cit_logo.png";

export const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mt-2 font-semibold text-5xl">Aprendiendo IA con CIT</h1>
      <div className="mt-4 w-[12em]">
        <img src={citLogo} alt="CIT logo" />
      </div>
    </div>
  );
};
