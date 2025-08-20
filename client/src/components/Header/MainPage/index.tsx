import Navigation from "./Navigation";
import Topbar from "./topbar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <Topbar />
      <Navigation />
    </header>
  );
};

export default Header;