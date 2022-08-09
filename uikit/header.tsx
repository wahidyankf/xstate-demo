import Link from "next/link";

function Header() {
  let renderSeparator = () => {
    return <span> |&gt; </span>;
  };

  return (
    <div>
      <Link href="/">Home</Link>
      {renderSeparator()}
      <Link href="/traffic-light-01-simple">
        Traffic Light Machine - 01 - Simple
      </Link>
      {renderSeparator()}
      <Link href="/traffic-light-full">Traffic Light Machine - Full</Link>
      {renderSeparator()}
      <Link href="/form-01-simple">Form - 01 - Simple</Link>
      {renderSeparator()}
      <Link href="/form-02-not-so-simple">Form - 02 - Not So Simple</Link>
    </div>
  );
}

export default Header;
