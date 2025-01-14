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
  onCancel,
  children,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
  children: JSX.Element;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
    }
  };

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogPortal>
        <DialogContent
          className="border-none bg-transparent p-0 duration-0"
          onClose={undefined}
        >
          <div className="flex flex-col gap-2 rounded-lg border bg-white p-8 shadow-lg dark:bg-slate-950 sm:rounded-lg">
            <DialogDescription className="hidden">
              Ingredient modal
            </DialogDescription>
            <p>Edit Ingredient</p>
            {children}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
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
