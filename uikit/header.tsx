import Link from "next/link";

function Header() {
  return (
    <div>
      <p>Menu</p>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/traffic-light-01-simple">
            Traffic Light Machine - 01 - Simple
          </Link>
        </li>
        <li>
          <Link href="/traffic-light-full">Traffic Light Machine - Full</Link>
        </li>
        <li>
          <Link href="/form-00-very-simple">Form - 00 - Very Simple</Link>
        </li>
        <li>
          <Link href="/form-01-simple">Form - 01 - Simple</Link>
        </li>
        <li>
          <Link href="/form-02-not-so-simple">Form - 02 - Not So Simple</Link>
        </li>
        <li>
          <Link href="/form-03-multistep">Form - 03 - Multistep</Link>
        </li>
      </ul>
      <hr></hr>
    </div>
  );
}

export default Header;
