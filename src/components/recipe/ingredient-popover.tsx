import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
} from "~/components/UI/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/UI/drawer";
import { useMediaQuery } from "usehooks-ts";

const IngredientPopover = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  children: JSX.Element;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // const springTransition = { duration: 0.7, type: "spring", bounce: 0 };

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogPortal forceMount>
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
        ></motion.div> */}
        <DialogDescription className="hidden">
          Ingredient modal
        </DialogDescription>
        <DialogContent className="border-none bg-transparent p-0 duration-0">
          <div
            // layoutId={`modal-${i}`}
            // transition={springTransition}
            className="flex flex-col gap-2 rounded-lg border bg-white p-8 shadow-lg dark:bg-slate-950 sm:rounded-lg"
          >
            <p>Edit Ingredient</p>
            {children}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Ingredient</DrawerTitle>
          <DrawerDescription className="hidden">
            Ingredient Drawer
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default IngredientPopover;
