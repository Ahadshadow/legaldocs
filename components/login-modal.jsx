import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import SignIn from "./auth/sign-in";

const LoginModal = (props) => {
  const { open, toggleModal } = props;
  return (
    <Dialog open={open} onOpenChange={toggleModal}>
      <DialogTitle />
      <DialogContent className="max-w-sm">
        <SignIn onSuccessfullLoginCB={toggleModal} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
