"use client";
import { removeSession } from "@/actions/user.actions";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useUser } from "@auth0/nextjs-auth0";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function RootNavbar({session} :{session: SessionData | null}) {
  const navItems = [
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const { user } = useUser();

  return (
    <div className="absolute z-99 w-full backdrop-blur-xl">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* {!user ? ( */}
            {!session ? (
              <NavbarButton
                href="/auth/login"
                variant="primary"
                className="text-sm 2xl:text-lg"
              >
                Signin
              </NavbarButton>
            ) : (
              <NavbarButton
                variant="primary"
                className="text-sm 2xl:text-lg"
                onClick={async () => {
                  await removeSession(session!)
                  redirect("/auth/logout");
                }}
              >
                Signout
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
