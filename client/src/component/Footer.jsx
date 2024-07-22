import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsFacebook, BsInstagram, BsGithub, BsTwitter, BsLinkedin} from 'react-icons/bs'
import Logo from '../assets/logo.png'

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
          <div className="flex   items-center">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-10  sm:w-20 sm:h-20  "
                />{" "}
                <span className="text-xl  text-gray-500 font-light">
                  Create Free Shop
                </span>{" "}
              </div>{" "}
          </div>
          <div className="grid grid-cols-2 gap-8  mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  add something
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   add something
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Contact us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                   rel="noopener noreferrer"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href='#'
                   rel="noopener noreferrer"
                >
                  Term &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Contact us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://.com/sadar786"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   add something
                </Footer.Link>
                <Footer.Link
                  href='/'
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   add something
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider/>
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="developer sadar's team" year={new Date().getFullYear()}/>
      <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
        <Footer.Icon href="#" icon={BsFacebook}/>
        <Footer.Icon href="#" icon={BsGithub}/>
        <Footer.Icon href="#" icon={BsInstagram}/>
        <Footer.Icon href="#" icon={BsTwitter}/>
        <Footer.Icon href="#" icon={BsLinkedin}/>
      </div>
        </div>
      </div>
    </Footer>
  );
}
