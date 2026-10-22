import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
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

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
    }
  };

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogPortal>
        <DialogContent className="border-none bg-transparent p-0 duration-0">
          <div className="flex max-h-[calc(100dvh-2rem)] flex-col gap-2 overflow-y-auto rounded-lg border bg-white p-8 shadow-lg dark:bg-slate-950 sm:rounded-lg">
            <DialogDescription className="hidden">
              Ingredient modal
            </DialogDescription>
            <DialogTitle className="text-base font-normal">
              Edit Ingredient
            </DialogTitle>
            {children}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[calc(100dvh-1rem)]">
        <DrawerHeader className="shrink-0">
          <DrawerTitle>Edit Ingredient</DrawerTitle>
          <DrawerDescription className="hidden">
            Ingredient Drawer
          </DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default IngredientPopover;
