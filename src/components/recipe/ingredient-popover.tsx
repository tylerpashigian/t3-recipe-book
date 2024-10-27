import { Dialog, DialogContent, DialogPortal } from "~/components/UI/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/components/UI/drawer";
import { useMediaQuery } from "usehooks-ts";

const IngredientPopover = ({
  isOpen,
  setIsOpen,
  i,
  children,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  i: number;
  children: JSX.Element;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // const springTransition = { duration: 0.7, type: "spring", bounce: 0 };
  console.log(i);
  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogPortal forceMount>
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
        ></motion.div> */}
        <DialogContent className="border-none bg-transparent p-0 duration-0">
          <div
            key={`modal-key-${i}`}
            // layoutId={`modal-${i}`}
            // transition={springTransition}
            className="rounded-lg border bg-white p-4 shadow-lg dark:bg-slate-950 sm:rounded-lg"
          >
            <div className="flex flex-col gap-2 px-4 pb-4">
              <p>Edit Ingredient</p>
              {children}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Ingredient</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default IngredientPopover;
