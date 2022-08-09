import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/traffic-light-01-simple">
        <button>Traffic Light Machine - 01 - Simple</button>
      </Link>
      <br></br>
      <Link href="/traffic-light-full">
        <button>Traffic Light Machine - Full</button>
      </Link>
    </div>
  );
};

export default Home;
