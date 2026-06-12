import {
  faBookOpen,
  faChartLine,
  faClipboardList,
  faGear,
  faLeaf,
  faRightFromBracket,
  faUsers,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, usePage } from "@inertiajs/react";
import LayoutMain from "./Main";
import { confirmLogout } from "../Utils/confirmLogout";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: faChartLine,
    matches: ["/"],
  },
  {
    href: "/admin/menu-makanan",
    label: "Kelola Data Makanan",
    icon: faUtensils,
    matches: ["/admin/menu-makanan"],
  },
  {
    href: "/admin/informasi",
    label: "Kelola Edukasi Diabetes",
    icon: faBookOpen,
    matches: ["/admin/informasi"],
  },
  {
    href: "/admin/pengguna",
    label: "Kelola Pengguna",
    icon: faUsers,
    matches: ["/admin/pengguna"],
  },
  {
    href: "/admin/rekam-gizi",
    label: "Riwayat Perhitungan Gizi",
    icon: faClipboardList,
    matches: ["/admin/rekam-gizi"],
  },
  {
    href: "/account",
    label: "Pengaturan",
    icon: faGear,
    matches: ["/account"],
  },
  {
    href: "/logout",
    label: "Logout",
    icon: faRightFromBracket,
    matches: [],
    isLogout: true,
  },
];

function isActive(url, item) {
  if (item.href === "/") {
    return url === "/";
  }

  return item.matches.some((path) => url.startsWith(path));
}

function getPageTitle(url) {
  const activeItem = navItems.find((item) => isActive(url, item));

  return activeItem?.label || "Dashboard Admin";
}

function getPageSubtitle(url) {
  if (url.startsWith("/account")) {
    return "Kelola akses akun admin";
  }

  return "";
}

export default function LayoutAdmin({ children }) {
  const { url } = usePage();
  const pageTitle = getPageTitle(url);
  const pageSubtitle = getPageSubtitle(url);

  return (
    <LayoutMain>
      <div className="admin-shell">
        <aside className="admin-sidebar" aria-label="Navigasi admin">
          <Link href="/" className="admin-brand">
            <span className="admin-brand__mark">
              <FontAwesomeIcon icon={faLeaf} />
            </span>
            <span>
              <span className="admin-brand__title">Gizi Diabetes</span>
              <span className="admin-brand__subtitle">Admin Panel</span>
            </span>
          </Link>

          <nav className="admin-sidebar__nav">
            {navItems.map((item) => {
              const active = isActive(url, item);

              if (item.isLogout) {
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={confirmLogout}
                    className="admin-sidebar__link"
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`admin-sidebar__link ${
                    active ? "admin-sidebar__link--active" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div>
              <p className="admin-topbar__eyebrow">Sistem Informasi Gizi</p>
              <h1>{pageTitle}</h1>
              {pageSubtitle && (
                <p className="admin-topbar__subtitle">{pageSubtitle}</p>
              )}
            </div>
            <div className="admin-topbar__account" aria-label="Informasi admin">
              <div>
                <strong>Admin</strong>
                <span>@admin</span>
              </div>
              <span className="admin-topbar__badge">Mode Admin</span>
            </div>
          </header>

          <main className="admin-content">{children}</main>
        </div>
      </div>
    </LayoutMain>
  );
}
