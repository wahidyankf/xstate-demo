import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/traffic-light-01-simple">
        Traffic Light Machine - 01 - Simple
      </Link>
      <br></br>
      <Link href="/traffic-light-full">Traffic Light Machine - Full</Link>
    </div>
  );
};

export default Home;
