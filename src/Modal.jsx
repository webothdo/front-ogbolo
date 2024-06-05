import { useRef } from "react";

import { X } from "lucide-react";
import { useClickOutside } from "@react-hookz/web";

const Modal = ({ isOpen, onClose, content }) => {
  const modalRef = useRef();

  useClickOutside(modalRef, onClose);

  if (!isOpen) {
    return null;
  }
  return (
    <div className="flex justify-center items-center fixed w-full h-full bg-black bg-opacity-50 top-0 left-0 z-20 px-[1rem]">
      <div
        ref={modalRef}
        className="bg-white py-[2rem] px-[2rem] flex flex-col gap-y-[1rem] max-w-[30rem] border"
      >
        <button onClick={onClose} className="self-end">
          <X />
        </button>
        <div>
          <h2 className="text-2xl font-bold font-poppins mb-5">
            {content.title}
          </h2>
          <p className="font-roboto">{content.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
