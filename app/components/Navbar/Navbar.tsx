import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Web3Provider } from "@ethersproject/providers";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "#home-section", current: false },
  { name: "Exchange", href: "#exchange-section", current: false },
  { name: "Features", href: "#features-section", current: false },
  { name: "FAQ", href: "#faq-section", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSnackbarClose = (
    event: React.SyntheticEvent<Element, Event>,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const connectWallet = async () => {
    try {
      const provider: any = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        const ethersProvider = new Web3Provider(provider);
        const balance = await ethersProvider.getBalance(accounts[0]);
        setBalance(balance.toString());
        setSnackbarMessage("Wallet connected successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("MetaMask not detected");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Failed to connect wallet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Disclosure as="nav" className="navbar">
      <>
        <div className="mx-auto max-w-7xl p-3 md:p-4 lg:px-8">
          <div className="relative flex h-12 sm:h-20 items-center">
            <div className="flex flex-1 items-center sm:justify-between">
              {/* LOGO */}
              <div className="flex flex-shrink-0 items-center">
                <Typography variant="h6" color="#fff">
                  Logo
                </Typography>
              </div>

              {/* LINKS */}
              <div className="hidden lg:flex items-center border-right ">
                <div className="flex justify-end space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900"
                          : "navlinks text-white hover:text-offwhite hover-underline",
                        "px-3 py-4 rounded-md text-lg font-normal"
                      )}
                      aria-current={item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="hidden lg:flex justify-end text-xl font-semibold py-4 px-6 lg:px-12 navbutton text-white"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </div>

            {/* DRAWER FOR MOBILE VIEW */}
            <div className="block lg:hidden">
              <Bars3Icon
                className="block h-6 w-6 text-white"
                aria-hidden="true"
                onClick={() => setIsOpen(true)}
              />
            </div>

            {/* DRAWER LINKS DATA */}
            <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
              <Drawerdata />
            </Drawer>
          </div>
        </div>
        {error && <Typography color="error">{error}</Typography>}
        {account && (
          <div>
            <Typography>Account: {account}</Typography>
            <Typography>Balance: {balance} ETH</Typography>
            <Typography variant="h6">Recent Transactions:</Typography>
            <ul>
              {transactions.map((tx, index) => (
                <li key={index}>
                  {tx.hash} - {tx.value} ETH
                </li>
              ))}
            </ul>
          </div>
        )}
        <Snackbar open={snackbarOpen} autoHideDuration={6000}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
    </Disclosure>
  );
};

export default Navbar;
