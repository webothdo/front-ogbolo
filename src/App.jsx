import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Menu, X, Dot, ChevronRight } from "lucide-react";
import Fuse from "fuse.js";
import { useClickOutside } from "@react-hookz/web";

import Modal from "./Modal";

import "./App.css";

function App() {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const mobileNavRef = useRef();
  const searchRef = useRef();
  const mobileSearchRef = useRef();

  const fuse = new Fuse(posts, {
    keys: ["title", "description"],
  });

  const getPosts = async () => {
    const response = await fetch(
      " https://cloud.codesupply.co/endpoint/react/data.json"
    );
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const openMenu = () => {
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useClickOutside(mobileNavRef, (e) => {
    if (open) {
      closeMenu();
    }
  });

  useClickOutside(searchRef, (e) => {
    setShowSuggestions(false);
  });

  useClickOutside(mobileSearchRef, (e) => {
    if (mobileSearchOpen) {
      setMobileSearchOpen((value) => !value);
    }
  });

  const handleSearch = (e) => {
    setValue(e.target.value);
    if (e.target.value) {
      const result = fuse.search(e.target.value);
      setSuggestions(result);

      setShowSuggestions(true);
    } else {
      setSuggestions([]);
    }
  };

  const scrollInfo = {
    scrollDirection: "down",
    distanceFromTop: 0,
  };

  window.addEventListener("scroll", () => {
    const currentScrollPosition = window.scrollY;
    let direction =
      currentScrollPosition > scrollInfo.distanceFromTop ? "down" : "up";

    if (currentScrollPosition > 200 && direction === "down") {
      setTimeout(() => {
        document.querySelector("#top-bar").style =
          "transform: translateY(-100%);";
      }, 100);
    } else if (currentScrollPosition > 200 && direction === "up") {
      setTimeout(() => {
        document.querySelector("#top-bar").style = "transform: translateY(0);";
      }, 300);
    }
    scrollInfo.distanceFromTop = currentScrollPosition;
  });

  return (
    <>
      {/* mobile nav */}
      <nav className="md:hidden flex w-full justify-between py-[1.5rem] px-[1rem]">
        <button onClick={openMenu}>
          <Menu />
        </button>
        {!mobileSearchOpen && (
          <h2 className="font-bungee text-[1.5rem] font-bold">LOGOTYPE</h2>
        )}
        {mobileSearchOpen ? (
          <input
            ref={mobileSearchRef}
            type="text"
            className="text-black text-[1.2rem] border border-black w-[15rem] px-[0.5rem] py-[0.3rem] font-roboto font-medium focus:outline-none"
            value={value}
            onChange={(e) => handleSearch(e)}
          />
        ) : (
          <button onClick={() => setMobileSearchOpen((prev) => !prev)}>
            <Search color="black" />
          </button>
        )}
      </nav>
      <div
        ref={mobileNavRef}
        id="side-bar"
        className={
          open
            ? "md:hidden bg-white z-10 fixed top-0 h-full w-[17rem] left-0 duration-1000"
            : "md:hidden bg-white z-10 fixed top-0 left-[-17rem] h-full w-[16rem] duration-1000"
        }
      >
        <div className="flex justify-between items-center px-[1.2rem] py-[1rem] border-r border-r-black border-b border-b-black">
          <h2 className="font-bungee text-[1.3rem] font-bold">LOGOTYPE</h2>
          <X onClick={closeMenu} />
        </div>
        <div className="flex flex-col w-full items-start mt-[2rem] gap-[1rem] px-[0.5rem]">
          <p className="flex items-center border-b border-b-black pb-[1rem] w-full font-roboto font-semibold">
            Demos
            <span>
              <ChevronDown />
            </span>
          </p>
          <p className="flex items-center border-b border-b-black pb-[1rem] w-full font-roboto font-semibold">
            Post
            <span>
              <ChevronDown />
            </span>
          </p>
          <p className="flex items-center border-b border-b-black pb-[1rem] w-full font-roboto font-semibold">
            Features
            <span>
              <ChevronDown />
            </span>
          </p>
          <p className="flex items-center border-b border-b-black pb-[1rem] w-full font-roboto font-semibold">
            Category
            <span>
              <ChevronDown />
            </span>
          </p>
          <p className="flex items-center border-b border-b-black pb-[1rem] w-full font-roboto font-semibold">
            Shop
            <span>
              <ChevronDown />
            </span>
          </p>
          <button className="font-roboto font-bold">Buy Now</button>
        </div>
      </div>
      {/* side bar overlay */}
      <div
        className={
          open
            ? "md:hidden bg-black opacity-40 z-[5] fixed top-0 h-full w-[100%] left-0"
            : "md:hidden bg-white z-10 fixed top-0 left-[-100%] h-full w-[16rem]"
        }
      ></div>
      {/* Tob bar nav */}
      <nav
        id="top-bar"
        className="hidden mb-[3rem] bg-white md:flex w-full justify-center items-center flex-col sticky top-0 z-10 duration-700"
      >
        <div className="w-full px-[10rem] py-[1.9rem] flex justify-center items-center border-b border-b-black">
          {!showSuggestions && (
            <h2 className="ml-auto font-bungee font-bold text-[1.5rem]">
              LOGOTYPE
            </h2>
          )}
          {showSuggestions ? (
            <input
              ref={searchRef}
              type="text"
              className="ml-auto text-black text-[1.2rem] border border-black w-[15rem] px-[0.5rem] py-[0.3rem] font-roboto font-medium focus:outline-none"
              value={value}
              onChange={(e) => handleSearch(e)}
            />
          ) : (
            <button
              onClick={() => setShowSuggestions((prev) => !prev)}
              className="ml-auto"
            >
              <Search color="black" />
            </button>
          )}
        </div>
        <div className=" w-full flex justify-center h-[3rem] items-center border-b border-b-black space-x-[1.5rem] relative">
          <div>
            <p className="flex items-center font-roboto font-semibold">
              Demos
              <span>
                <ChevronDown />
              </span>
            </p>
          </div>
          <div className="dropdown-trigger h-full">
            <p className="dropdown-trigger flex items-center h-full font-roboto font-semibold">
              Post
              <span>
                <ChevronDown />
              </span>
            </p>
            <div className="dropdown-item hidden bg-white flex-col absolute top-[100%] w-[12rem] gap-[1rem] py-[1rem] px-[1rem] border">
              <div className="flex justify-between items-center border-b pb-[0.5rem]">
                <p className="hover:text-gray-500 hover:ml-[1rem] hover:duration-300 duration-500 font-roboto">
                  Post Header
                </p>
                <ChevronRight />
              </div>
              <div className="flex justify-between items-center border-b pb-[0.5rem]">
                <p className="hover:text-gray-500 hover:ml-[1rem] hover:duration-300 font-roboto">
                  Post Layout
                </p>
                <ChevronRight />
              </div>
              <div className="flex justify-between items-center border-b pb-[0.5rem]">
                <p className="hover:text-gray-500 hover:ml-[1rem] hover:duration-300 font-roboto">
                  Share Buttons
                </p>
                <ChevronRight />
              </div>
              <div className="flex justify-between items-center border-b pb-[0.5rem]">
                <p className="hover:text-gray-500 hover:ml-[1rem] hover:duration-300 font-roboto">
                  Gallery Post
                </p>
                <ChevronRight />
              </div>
              <div className="flex justify-between items-center pb-[0.5rem]">
                <p className="hover:text-gray-500 hover:ml-[1rem] hover:duration-300 font-roboto">
                  Video Post
                </p>
                <ChevronRight />
              </div>
            </div>
          </div>
          <p className="flex items-center font-roboto font-semibold">
            Features
            <span>
              <ChevronDown />
            </span>
          </p>
          <p className="flex items-center font-roboto font-semibold">
            Categories
            <span>
              <ChevronDown />
            </span>
          </p>
          <p className="flex items-center font-roboto font-semibold">
            Shop
            <span>
              <ChevronDown />
            </span>
          </p>
          <button className="font-roboto font-bold">Buy Now</button>
        </div>
      </nav>
      {!showSuggestions && (
        <div
          id="posts"
          className="w-full px-[1rem] flex flex-wrap items-center justify-center sm:items-start sm:justify-center gap-x-[40px] after:contents-[''] sm:after:basis-[50%] lg:after:basis-[33.5%] xl:after:basis-[calc(50%-1.5rem)] sm:px-[2rem] xl:px-[3rem]"
        >
          {posts.map((post, index) => (
            <div
              onClick={() => {
                openModal(post);
              }}
              key={index}
              className="mb-[3rem] px-[1rem] py-[1rem] max-w-[23rem] sm:w-[50%] hover:cursor-pointer"
            >
              <img
                src={post.img}
                srcSet={post.img_2x}
                alt=""
                className="object-cover w-full"
              />
              <div className="py-[0.5rem]">
                <h3 className="text-red-600 font-bold text-[0.8rem] font-roboto">
                  {post.tags}
                </h3>
                <div>
                  <h1 className="text-[1.5rem] font-bold font-poppins">
                    {post.title}
                  </h1>
                  <div>
                    <div className="flex items-center my-[0.5rem] font-roboto">
                      <p className="text-[0.9rem] font-semibold font-poppins">
                        {post.autor}
                      </p>
                      <Dot width={15} />
                      <p className="text-[0.9rem] text-gray-500">{post.date}</p>
                      <Dot width={15} />
                      <p className="text-[0.9rem] text-gray-500">
                        {post.views} Views
                      </p>
                    </div>
                    <p className="text-[1rem] text-neutral-600 font-roboto">
                      {post.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showSuggestions && (
        <div className="w-full px-[1rem] flex flex-wrap items-center justify-center sm:items-start sm:justify-center gap-x-[40px] after:contents-[''] sm:after:basis-[50%] lg:after:basis-[33.5%] xl:after:basis-[calc(50%-1.5rem)] sm:px-[2rem] xl:px-[3rem]">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="mb-[3rem] max-w-[22rem] sm:max-w-[19rem]"
            >
              <img src={suggestion.item.img} alt="" />
              <div className="py-[0.5rem]">
                <h3 className="text-red-600 font-bold text-[0.8rem]">
                  {suggestion.item.tags}
                </h3>
                <div>
                  <h1 className="text-[1.5rem] font-bold">
                    {suggestion.item.title}
                  </h1>
                  <div>
                    <div className="flex items-center my-[0.5rem]">
                      <p className="text-[0.9rem] font-bold">
                        {suggestion.item.autor}
                      </p>
                      <Dot width={15} />
                      <p className="text-[0.9rem] text-gray-500">
                        {suggestion.item.date}
                      </p>
                      <Dot width={15} />
                      <p className="text-[0.9rem] text-gray-500">
                        {suggestion.item.views} Views
                      </p>
                    </div>
                    <p className="text-[1rem] text-neutral-600">
                      {suggestion.item.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} content={modalContent} />
    </>
  );
}

export default App;
