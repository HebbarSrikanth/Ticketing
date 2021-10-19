import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign in', href: '/auth/signin' },
    !currentUser && { label: 'Sign up', href: '/auth/signup' },
    currentUser && { label: 'My Orders', href: '/orders/myorders' },
    currentUser && { label: 'Sell Ticket', href: '/tickets/createnew' },
    currentUser && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter((u) => u)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <Link href="/">
          <a className="navbar-brand">Ticketing</a>
        </Link>
        <div className="collapse d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">{links}</ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
