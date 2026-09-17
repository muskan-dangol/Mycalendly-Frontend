import { Button } from "../components/ui/button";
// import { useRedirectIfNotAuthenticated } from "../constant";

export const HomePage = () => {
  // useRedirectIfNotAuthenticated();

  return (
    <div>
      <h1 className="!text-5xl !font-bold">When can we meet next?</h1>
      <Button type="button" variant="hero" className="mt-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
        Check my calendar
      </Button>
    </div>
  );
};
