import {
  faBowlFood,
  faCalculator,
  faClockRotateLeft,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, usePage } from "@inertiajs/react";
import LayoutMain from "./Main";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: faHouse,
    matches: ["/"],
  },
  {
    href: "/user/rekam-gizi/create",
    label: "Hitung",
    icon: faCalculator,
    matches: ["/user/rekam-gizi/create"],
  },
  {
    href: "/user/menu-rekomendasi",
    label: "Makanan",
    icon: faBowlFood,
    matches: ["/user/menu-rekomendasi", "/user/menu-makanan"],
  },
  {
    href: "/user/rekam-gizi",
    label: "Riwayat",
    icon: faClockRotateLeft,
    matches: ["/user/rekam-gizi"],
    excludes: ["/user/rekam-gizi/create"],
  },
  {
    href: "/account",
    label: "Profil",
    icon: faUser,
    matches: ["/account"],
  },
];

function isActive(url, item) {
  const currentPath = `/${String(url || "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")}`;

  if (item.href === "/") {
    return currentPath === "/";
  }

  if (item.excludes?.some((path) => currentPath.startsWith(path))) {
    return false;
  }

  return item.matches.some((path) => currentPath.startsWith(path));
}

export default function LayoutUser({ children }) {
  const { url } = usePage();

  return (
    <>
      <LayoutMain>
        <main className="app-shell">{children}</main>

        <nav className="bottom-nav" aria-label="Navigasi pengguna">
          <div className="bottom-nav__inner bottom-nav__inner--5">
            {navItems.map((item) => {
              const active = isActive(url, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`bottom-nav__item ${
                    active ? "bottom-nav__item--active" : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="bottom-nav__icon"
                  />
                  <span className="bottom-nav__label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </LayoutMain>
    </>
  );
}
