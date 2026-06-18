import { Box } from "lucide-react";
import Button from "../components/ui/Button";
import { useNavigate, useOutletContext } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const { isSignedIn, signIn, signOut, userName } =
    useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`puter sign out failed ${e}`);
      }
      return;
    }

    try {
      await signIn();
    } catch (e) {
      console.error(`puter sign in failed ${e}`);
    }
    return;
  };
  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand" onClick={() => navigate("/")}>
            <Box className="logo" />

            <span className="name">Planora</span>
          </div>

          <ul className="links">
            <a href="/creations">creations</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#community">Community</a>
            <a href="#enterprise">Enterprise</a>
          </ul>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Hi, ${userName}` : "Signed in"}
              </span>
              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Log In
              </Button>

              <a href="#upload" className="cta">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
