import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";

type DrawerProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Drawer({
  title = "",
  description = "",
  children,
  isOpen,
  setIsOpen,
}: DrawerProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        unmount={false}
        onClose={() => setIsOpen(false)}
        // className="r-0 fixed inset-0 z-30 w-full overflow-y-auto"
      >
        <div
          className="relative z-10"
          aria-labelledby="slide-over-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                />
              </Transition.Child>
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="ttransform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <div className="pointer-events-auto relative w-screen md:w-auto">
                    {/* Close button, show/hide based on slide-over state.

            Entering: "ease-in-out duration-500"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in-out duration-500"
              From: "opacity-100"
              To: "opacity-0" */}
                    <div className="absolute right-0 top-0 -ml-8 flex pr-4 pt-7 md:-ml-10 md:pr-6">
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="relative rounded-md text-lg text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-white md:text-2xl"
                      >
                        <span className="absolute"></span>
                        <span className="sr-only">Close panel</span>
                        <IoClose />
                      </button>
                    </div>

                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      {!!title ? (
                        <div className="px-4 sm:px-6">
                          <div
                            className="text-base font-semibold leading-6 text-gray-900"
                            id="slide-over-title"
                          >
                            <Dialog.Title className="text-2xl font-bold md:text-3xl">
                              {title}
                            </Dialog.Title>
                          </div>
                        </div>
                      ) : null}
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* <!-- Your content --> */}
                        {!!description ? (
                          <Dialog.Description>{description}</Dialog.Description>
                        ) : null}
                        {children}
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
